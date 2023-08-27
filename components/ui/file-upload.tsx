"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import "@uploadthing/react/styles.css";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

function FileUpload(props: FileUploadProps) {
  const { onChange, value, endpoint } = props;
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf")
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(err) => {
        console.log({ err });
      }}
    />
  );
}

export default FileUpload;
