"use client";
import React, { useState } from "react";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import { uploadBusinessImageAPI } from "@/lib/api";
interface UploadFormProps {
  onFileUrlChange: (url: string) => void;
  oldFileUrl?: string;
}

export const UploadForm = ({
  onFileUrlChange,
  oldFileUrl,
}: UploadFormProps) => {
  const { handleApiErrors } = useHandleApiErrors();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (oldFileUrl) {
      formData.append("oldFileUrl", oldFileUrl);
    }
    const response = await uploadBusinessImageAPI(formData);
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) {
      setUploading(false);
    }
    const data = await response.json();
    onFileUrlChange(data.fileUrl);
    setUploading(false);
    setFile(null);
  };

  return (
    <div className="full-w flex flex-row items-center justify-center p-3">
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="btn btn-primary ml-2"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};
