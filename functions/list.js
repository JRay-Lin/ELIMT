const { google } = require("googleapis");
const sqlite3 = require("sqlite3").verbose();
const settings = require("../data/settings.json");

async function listFiles(auth, folderId) {
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
        let allFiles = [];

        // Get all folders insidet the master folder
        const folderRes = await drive.files.list({
            pageSize: settings.File_Amount,
            fields: "nextPageToken, files(id, name)",
            orderBy: "createdTime desc",
            q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
        });

        const folders = folderRes.data.files;
        console.log("Folders:");
        console.log(folders);

        if (folders.length === 0) {
            console.log("No folders found.");
        } else {
            // Get all files inside each folder
            for (const folder of folders) {
                const fileRes = await drive.files.list({
                    pageSize: settings.File_Amount,
                    fields: "nextPageToken, files(id, name)",
                    orderBy: "createdTime desc",
                    q: `'${folder.id}' in parents`,
                });

                const files = fileRes.data.files;
                if (files.length > 0) {
                    allFiles = allFiles.concat(
                        files.map((file) => ({
                            id: file.id,
                            name: file.name,
                        }))
                    );
                }
            }
            console.log(allFiles);
            console.log("All files retrieved. Starting database operations...");
            await resetAndInsertFiles(db, allFiles);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        db.close((err) => {
            if (err) {
                console.error("Error closing the database:", err.message);
            } else {
                console.log("Database connection closed.");
            }
        });
    }
}

async function resetAndInsertFiles(db, files) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // First, reset the 'files' table
            db.run(`DELETE FROM files`, (err) => {
                if (err) {
                    console.error(
                        "Error resetting the files table:",
                        err.message
                    );
                    reject(err);
                    return;
                }
                console.log("Table has been reset");

                // Then, reset the autoincrement for 'files'
                db.run(
                    `DELETE FROM sqlite_sequence WHERE name='files'`,
                    (err) => {
                        if (err) {
                            console.error(
                                "Error resetting autoincrement:",
                                err.message
                            );
                            reject(err);
                            return;
                        }
                        console.log("Autoincrement reset");

                        // Prepare the SQL statement outside the loop
                        const insertStmt = db.prepare(
                            `INSERT INTO files (googleId, googleName, username, fullname, filename, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)`
                        );

                        // Iterate through each file and insert its data
                        files.forEach((file) => {
                            const fileInfo = file.name.split("-");
                            if (fileInfo.length < 5) {
                                console.log(
                                    `File name format is incorrect: ${file.name}`
                                );
                                return;
                            }

                            // Parse the file info
                            const status = fileInfo[0];
                            const date = `${fileInfo[1].substring(
                                0,
                                4
                            )}-${fileInfo[1].substring(
                                4,
                                6
                            )}-${fileInfo[1].substring(6, 8)}`;
                            const username = fileInfo[2];
                            const fullname = fileInfo[3];
                            const filename = fileInfo.slice(4).join("-");

                            // Execute the insert statement
                            insertStmt.run(
                                [
                                    file.id,
                                    file.name,
                                    username,
                                    fullname,
                                    filename,
                                    date,
                                    status,
                                ],
                                (err) => {
                                    if (err) {
                                        console.error(
                                            "Error inserting file data:",
                                            err.message
                                        );
                                        insertStmt.finalize(); // Make sure to finalize the statement on error
                                        reject(err);
                                        return;
                                    }
                                }
                            );
                        });

                        // Finalize the statement after all files have been processed
                        insertStmt.finalize(() => {
                            console.log("All files have been inserted.");
                            resolve();
                        });
                    }
                );
            });
        });
    });
}

module.exports = {
    listFiles,
};
