import { NextResponse, NextRequest } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";
import rateLimitMiddleware from "@/lib/rateLimit";
import { allowedFileTypes, fileSizeLimit } from "@/util/imageRestriction";

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

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const oldFileUrl = formData.get("oldFileUrl");

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
    const fileName = `${Date.now()}-${file.name}`;
    const fileUrl = await uploadFileToS3(buffer, fileName, file.type);

    if (oldFileUrl) {
      await deleteFileFromS3(oldFileUrl);
    }

    return NextResponse.json({ success: true, fileUrl }, { status: 200 });
  } catch (err: any) {
    console.error("Error uploading file:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}, 5);
