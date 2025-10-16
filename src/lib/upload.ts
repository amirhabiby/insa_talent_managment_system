// lib/upload.ts
"use server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadFile(
  file: File,
  directory: string = "uploads"
): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", directory);
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const originalName = file.name;

    const fileExtension = originalName.includes(".")
      ? originalName.split(".").pop()
      : "";

    const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${sanitizedOriginalName}`;

    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return `/${directory}/${fileName}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
}

export async function uploadMultipleFiles(
  files: File[],
  directory: string = "uploads"
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadFile(file, directory));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw new Error("Failed to upload files");
  }
}
