// pages/api/upload-image.ts

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { imageData } = req.body;

  if (!imageData || !imageData.startsWith("data:image")) {
    return res.status(400).json({ message: "Invalid image data" });
  }

  try {
    // Extract the base64 content and image type
    const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid image format");

    const ext = matches[1];
    const base64Data = matches[2];
    const fileName = `uploaded-${Date.now()}.${ext}`;

    const filePath = path.join(process.cwd(), "public", fileName);
    const buffer = Buffer.from(base64Data, "base64");

    // Save the file
    fs.writeFileSync(filePath, buffer);

    // Return public URL
    const imageUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/${fileName}`;

    return res.status(200).json({ imageUrl });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error saving image", error: error.message });
  }
}
