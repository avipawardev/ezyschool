import { Storage } from "@google-cloud/storage";

// Initialize Storage with credentials from env
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY
      ? process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined,
  },
});

const bucketName = process.env.GCLOUD_BUCKET_NAME || "ezyschool-bucket";

export const generateUploadSignedUrl = async (fileName, fileType) => {
  try {
    const options = {
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: fileType,
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    return url;
  } catch (error) {
    console.error("GCS Upload URL Error:", error.message);
    throw new Error("Failed to generate upload URL");
  }
};

export const generateReadSignedUrl = async (fileName) => {
  try {
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    return url;
  } catch (error) {
    console.error("GCS Read URL Error:", error.message);
    throw new Error("Failed to generate read URL");
  }
};

export const deleteFile = async (fileName) => {
  try {
    await storage.bucket(bucketName).file(fileName).delete();
  } catch (error) {
    console.error("GCS Delete Error:", error.message);
    // Ignore if file not found
  }
};
