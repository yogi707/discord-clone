"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
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

  if (value && fileType == "pdf") {
    return (
      <div className="relative flex items-center p-2 m-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-inherit stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 dark:text-inherit hover:underline"
        >
          {value}
        </a>

        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

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
