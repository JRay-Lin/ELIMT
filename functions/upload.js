const { google } = require("googleapis");
const sqlite3 = require("sqlite3").verbose();
const createFolder = require("./folder.js");
const fs = require("fs"); // 確保引入 fs 模組

async function uploadFile(auth, fileName, filePath, username) {
    const drive = google.drive({ version: "v3", auth });
    const db = new sqlite3.Database("./data/system.sqlite", (err) => {
        if (err) {
            console.error(
                "Failed to connect to the sqlite database:",
                err.message
            );
            return;
        }
        console.log("Connected to the sqlite database.");
    });

    try {
        const folderId = await new Promise((resolve, reject) => {
            db.get(
                "SELECT folderID FROM users WHERE username = ?",
                [username],
                async (err, row) => {
                    if (err) {
                        console.error("Failed to retrieve data:", err.message);
                        reject(err);
                        return;
                    }

                    if (row && row.folderID) {
                        resolve(row.folderID);
                    } else if (row && row.folderID === null) {
                        try {
                            const newFolderId = await createFolder(
                                auth,
                                username
                            );
                            resolve(newFolderId);
                        } catch (error) {
                            console.error("Failed to create folder:", error);
                            reject(error);
                        }
                    } else {
                        console.log(
                            "No data found for the specified username."
                        );
                        resolve(null);
                    }
                }
            );
        });

        if (!folderId) {
            throw new Error("No folder ID obtained.");
        }

        const fileMetadata = {
            name: fileName,
            parents: [folderId],
        };
        const media = {
            mimeType: "application/pdf",
            body: fs.createReadStream(filePath),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });

        console.log("File ID:", file.data.id, "Uploaded");
        return file.data.id; // 回傳檔案 ID
    } catch (error) {
        console.error("Error:", error);
        throw error;
    } finally {
        // 確保數據庫連接在所有操作完成後關閉
        db.close((err) => {
            if (err) {
                console.error("Error closing the database:", err.message);
            } else {
                console.log("Database connection closed.");
            }
        });
    }
}

module.exports = {
    uploadFile,
};
