"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

type ImageUploadFieldProps = {
  name: string;
  initialValue?: string | null;
  label?: string;
};

export function ImageUploadField({
  name,
  initialValue,
  label = "Cover Image",
}: ImageUploadFieldProps) {
  const [imageUrl, setImageUrl] = useState(initialValue || "");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setError("");
    setIsUploading(true);

    const payload = new FormData();
    payload.append("file", file);

    try {
      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: payload,
      });

      const body = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !body.url) {
        throw new Error(body.error || "Upload failed.");
      }

      setImageUrl(body.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>

      <input type="hidden" name={name} value={imageUrl} readOnly />

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="image-upload-input"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void uploadFile(file);
          }
        }}
      />

      <button
        type="button"
        className={`image-upload-zone ${isDragging ? "image-upload-zone-active" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) {
            void uploadFile(file);
          }
        }}
      >
        <span className="image-upload-title">
          {isUploading ? "Uploading image..." : "Drag and drop an image here"}
        </span>
        <span className="image-upload-copy">
          or click to choose a file from your device
        </span>
      </button>

      {imageUrl && (
        <div className="image-upload-preview">
          <div className="image-upload-preview-frame">
            <Image
              src={imageUrl}
              alt="Uploaded preview"
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="image-upload-preview-meta">
            <span className="image-upload-copy">{imageUrl}</span>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setImageUrl("");
                setError("");
              }}
            >
              Remove image
            </button>
          </div>
        </div>
      )}

      {error && <p className="image-upload-error">{error}</p>}
    </div>
  );
}
