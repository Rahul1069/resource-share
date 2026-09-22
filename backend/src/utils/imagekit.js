import ImageKit from "imagekit";
import "dotenv/config";
import fs from "fs";
import path from "path";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadOnImageKit = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Read file as base64
    const fileBuffer = fs.readFileSync(localFilePath);
    const base64File = fileBuffer.toString("base64");

    const fileName = path.basename(localFilePath);

    const response = await imagekit.upload({
      file: base64File,
      fileName: fileName,
      useUniqueFileName: true,
    });

    console.log(
      "File uploaded on ImageKit:",
      response.url
    );

    // Delete temporary local file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.log("ImageKit upload error:", error);

    // Delete temporary file if it exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnImageKit };
