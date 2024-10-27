import { NextResponse, NextRequest } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";
import rateLimitMiddleware from "@/lib/rateLimit";
import { allowedFileTypes, fileSizeLimit } from "@/util/imageRestriction";
// import { formDataSchema } from "@/util/apiTypeSchema";
import Business from "@/lib/models/Business";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(fileBuffer, fileName, fileType) {
  const uploadParams = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);

  const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${fileName}`;
  return fileUrl;
}

async function deleteFileFromS3(fileUrl) {
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
  const key = fileUrl.split(
    `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/`,
  )[1];

  if (!key) {
    throw new Error("Invalid file URL");
  }

  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new DeleteObjectCommand(deleteParams);
  await s3Client.send(command);
}
export const POST = rateLimitMiddleware(async (req: NextRequest) => {
  // export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  //check if the client is business account.
  const business = await Business.findOne({
    clerkUserId: userId,
  });

  if (!business) {
    return NextResponse.json(
      { message: "Business not found. Signing user out." },
      { status: 401 },
    );
  }

  try {
    const formData = await req.formData();

    console.log(formData, "form data received");

    // const parsedData = formDataSchema.safeParse({
    //   oldFileUrl: formData.get("oldFileUrl"),
    // });

    // if (!parsedData.success) {
    //   console.log("in,,,");
    //   return NextResponse.json({ error: "Type not valid" }, { status: 400 });
    // }
    const file = formData.get("file");
    console.log(file, "extracting file from the formData");
    const oldFileUrl = formData.get("oldFileUrl");
    console.log(file, "extracting the old file from the formData");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "File is required and must be of type File." },
        { status: 400 },
      );
    }

    if (file.size > fileSizeLimit) {
      return NextResponse.json(
        { error: "File size exceeds the 5 MB limit." },
        { status: 400 },
      );
    }

    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG and PNG are allowed." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(buffer, "buffer");
    const fileName = `${Date.now()}-${file.name}`;
    console.log(fileName, "file Name, and ready to upload to S3");
    const fileUrl = await uploadFileToS3(buffer, fileName, file.type);

    console.log("update to S3 completed, and link is:", fileUrl);
    if (oldFileUrl) {
      console.log(oldFileUrl, "deleting the old file url");
      await deleteFileFromS3(oldFileUrl);
      console.log("finished deleting");
    }

    return NextResponse.json({ success: true, fileUrl }, { status: 200 });
  } catch (err: any) {
    console.error("Error uploading file:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}, 100);
