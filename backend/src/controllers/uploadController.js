import { generateUploadSignedUrl } from "../services/storageService.js";

export const getUploadUrl = async (req, res, next) => {
  try {
    const { folder, fileType } = req.body;

    if (!folder || !fileType) {
      return res.status(400).json({
        success: false,
        message: "Folder and fileType (MIME type) are required",
      });
    }

    // Generate unique filename: folder/timestamp-random.ext
    // Extracted from fileType, e.g., "image/jpeg" -> .jpeg or leave logical
    // We just rely on client to send correct contentType during upload
    const extension = fileType.split("/")[1];
    const fileName = `${folder}/${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}.${extension}`;

    const url = await generateUploadSignedUrl(fileName, fileType);

    res.status(200).json({
      success: true,
      message: "Upload URL generated",
      data: {
        uploadUrl: url,
        fileName: fileName,
        publicUrl: `https://storage.googleapis.com/${
          process.env.GCLOUD_BUCKET_NAME || "ezyschool-bucket"
        }/${fileName}`, // Only valid if public, but for signed URL flow, we usually store the path
        filePath: fileName,
      },
    });
  } catch (error) {
    next(error);
  }
};
