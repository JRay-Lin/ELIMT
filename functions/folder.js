const { google } = require("googleapis");
const sqlite3 = require("sqlite3").verbose();

async function createFolder(auth, username) {
    const drive = google.drive({ version: "v3", auth });
    const settings = require("../data/settings.json");
    const parentFolder = settings.folder;

    // 連接到資料庫
    let db = new sqlite3.Database("./data/system.sqlite", (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(
                "Connected to the mydb sqlite database (Create folder)."
            );
        }
    });

    return new Promise((resolve, reject) => {
        // 查詢用戶的 fullname
        db.get(
            `SELECT fullname FROM users WHERE username = ?`,
            [username],
            (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else if (row) {
                    const fullname = row.fullname;
                    console.log(`fullname is ${fullname}`);

                    // 在 Google Drive 中建立資料夾
                    const fileMetadata = {
                        name: fullname,
                        mimeType: "application/vnd.google-apps.folder",
                        parents: [parentFolder],
                    };

                    drive.files.create(
                        {
                            resource: fileMetadata,
                            fields: "id",
                        },
                        (err, file) => {
                            if (err) {
                                console.error(err.message);
                                reject(err);
                            } else {
                                let newFolder = file.data.id;
                                console.log("Folder ID: ", newFolder);

                                // 將資料夾 ID 儲存到資料庫
                                db.run(
                                    `UPDATE users SET folderID = ? WHERE username = ?`,
                                    [newFolder, username],
                                    (err) => {
                                        if (err) {
                                            console.error(err.message);
                                            reject(err);
                                        } else {
                                            console.log(
                                                `FolderID ${newFolder} updated for user ${username}`
                                            );
                                            resolve(newFolder);
                                        }

                                        // 關閉資料庫連線
                                        db.close((err) => {
                                            if (err) {
                                                console.error(err.message);
                                            } else {
                                                console.log(
                                                    "Closed the database connection."
                                                );
                                            }
                                        });
                                    }
                                );
                            }
                        }
                    );
                } else {
                    console.log(`No user found with username ${username}`);
                    reject(
                        new Error(`No user found with username ${username}`)
                    );

                    // 關閉資料庫連線
                    db.close((err) => {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("Closed the database connection.");
                        }
                    });
                }
            }
        );
    });
}

module.exports = createFolder;
