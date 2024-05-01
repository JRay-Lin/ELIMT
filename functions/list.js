const { google } = require("googleapis");
const sqlite3 = require("sqlite3").verbose();

async function listFiles(auth, folderId) {
  const drive = google.drive({ version: "v3", auth });
  const settings = require("../data/settings.json");

  const res = await drive.files.list({
    pageSize: settings.File_Amount,
    fields: "nextPageToken, files(id, name)",
    orderBy: "createdTime desc",
    q: `'${folderId}' in parents`,
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log("No files found.");
    return;
  }

  let db = new sqlite3.Database("./data/system.sqlite", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the mydb sqlite database.");
  });

  db.serialize(() => {
    // 檔案紀錄重置
    db.run(`DELETE FROM files`, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Table has been reset");
    });

    // 重置ID
    db.run(`DELETE FROM sqlite_sequence WHERE name='files'`, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Autoincrement reset");
    });

    // Insert new data
    files.forEach((file) => {
      const normalizedFileName = file.name.replace(/^checked-/, "");
      const fileInfo = normalizedFileName.split("-");

      if (fileInfo.length < 4) {
        console.log(`File name format is incorrect: ${file.name}`);
        return;
      }

      const check = file.name.startsWith("checked-") ? "true" : "false";
      const date = `${fileInfo[0].substring(0, 4)}-${fileInfo[0].substring(
        4,
        6
      )}-${fileInfo[0].substring(6, 8)}`;
      const username = fileInfo[1];
      const fullname = fileInfo[2];
      const filename = fileInfo.slice(3).join("-");

      db.run(
        `INSERT INTO files ("googleId", "googleName", "username", "fullname", "filename", "date", "check") VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [file.id, file.name, username, fullname, filename, date, check], 
        function (err) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Successfully added data with rowid ${this.lastID}`);
        }
      );
    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
}

module.exports = {
  listFiles,
};
