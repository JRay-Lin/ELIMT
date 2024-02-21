const { google } = require("googleapis");
const fs = require("fs");

async function uploadFile(auth, folderId, fileName, filePath) {
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };
  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log("File ID:", file.data.id, "Uploaded");
    return file.data.id; // 回傳檔案 ID
  } catch (error) {
    console.error("The API returned an error: " + error);
    throw error;
  }
}

module.exports = {
  uploadFile,
};
