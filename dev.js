require('dotenv').config();
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const sqlite3 = require("sqlite3");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const uploadsFolder = "./uploads/";
const settings = require("./settings.json");


//GoogleDrive 組件
const { authorize } = require("./functions/auth_modules");
const { uploadFile } = require("./functions/upload");
const { listFiles } = require("./functions/list");
const { checkedFile } = require("./functions/checked");

//設定
const app = express();
const db = new sqlite3.Database("mydb.sqlite"); //database connect
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB
});
const port = 3001;
const mailerinterval = settings.SystemMailInterval * 3600000;

// 解析POST請求
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // 添加 JSON 解析

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// 登錄
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (!row) {
      res.status(401).json({ error: "Username not found" });
      return;
    }

    // 登入驗證、回傳
    if ( password === row.password ) {
      req.session.user = username;

      const userJson = {
        username: row.username,
        fullname: row.fullname,
        privilege: row.privilege,
        email: row.email,
      };

      // 檢查是否 privilege 等於 3
      if (row.privilege === "3") {
        // 讀取 settings.json 文件
        const settingsPath = path.join("./settings.json");
        fs.readFile(settingsPath, (err, data) => {
          if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Failed to load settings" });
            return;
          }
          
          // 將 settings.json 內容添加到回應中
          userJson.settings = JSON.parse(data);
          res.json({
            success: true,
            authenticated: true,
            message: "Login success",
            user: userJson,
          });
        });
      } else {
        // 如果 privilege 不是 3，僅返回基本信息
        res.json({
          success: true,
          authenticated: true,
          message: "Login success",
          user: userJson,
        });
      }
    } else {
      res.status(401).json({ error: "Incorrect password" });
    }
  });
});

// 登出
app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
})

// 登入認證
app.get("/checkAuth", (req, res) => {
  if (req.session.user) {
    res.status(200).send("Authenticated");
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Oauth
app.get("/oauth", (req, res) => {
  authorize()
    .then((auth) => {
      res.redirect("/");
    })
    .catch((error) => {
      console.error("Authorization failed:", error);
      res.status(500).send("Failed to authorize.");
    });
});

// 更新帳號
app.post("/api/account/", (req, res) => {
  const { username, fullname, email, password, privilege } = req.body;
  const { modify } = req.query;

  switch (modify) {
    case "insert":
      if (!username || !privilege) {
        res.status(400).json({ error: "Missing required fields for insert operation." });
        return;
      }

      let sqlInsert = "INSERT INTO users (username, privilege, password ) VALUES (?, ?, ? )";
      let paramsInsert = [username.trim(), privilege.trim(), "lab12345"];

      db.run(sqlInsert, paramsInsert, (err) => {
        if (err) {
          console.error(err.message);
          if (err.code === "SQLITE_CONSTRAINT") {
            res.status(409).json({ error: "Username already exists" });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
          return;
        }
        res.json({ success: true, message: "Account inserted successfully" });
      });
      break;

    case "delete":
      if (!username) {
        res.status(400).json({ error: "Missing username field for delete operation." });
        return;
      }

      let sqlDelete = "DELETE FROM users WHERE username = ?";
      let paramsDelete = [username.trim()];

      db.run(sqlDelete, paramsDelete, (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.json({ success: true, message: "Account deleted successfully" });
      });
      break;

    case "update":
      if (!username) {
        res.status(400).json({ error: "Missing username field for update operation." });
        return;
      }

      let sqlUpdate = "UPDATE users SET";
      let paramsUpdate = [];
      let toUpdate = [];

      if (fullname && fullname.trim() !== '') {
        toUpdate.push(" fullname = ?");
        paramsUpdate.push(fullname.trim());
      }

      if (email && email.trim() !== '') {
        toUpdate.push(" email = ?");
        paramsUpdate.push(email.trim());
      }

      if (password && password.trim() !== '') {
        toUpdate.push(" password = ?");
        paramsUpdate.push(password.trim());
      }

      if (privilege && privilege.trim() !== '') {
        toUpdate.push(" privilege = ?");
        paramsUpdate.push(privilege.trim());
      }

      if (toUpdate.length === 0) {
        res.json({ warning: "No update performed due to empty fields." });
        return;
      }

      sqlUpdate += toUpdate.join(", ");
      sqlUpdate += " WHERE username = ?";
      paramsUpdate.push(username.trim());

      db.run(sqlUpdate, paramsUpdate, (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.json({ success: true, message: "Account updated successfully" });
      });
      break;

    default:
      res.status(400).json({ error: "Invalid modify parameter." });
      break;
  }
});

// 帳號列表
app.get("/api/account/list", (req, res) => {
  const query = 'SELECT "username", "privilege", "fullname", "email" FROM USERS'

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

// Files API
app.get("/api/files", (req, res) => {
  const { username, check } = req.query;

  let query =
    'SELECT "googleId", "filename", "username", "fullname", "date", "check" FROM files';
  const params = [];

  if (username || check) {
    let conditions = [];

    if (username) {
      conditions.push('"username" = ?');
      params.push(username);
    }

    if (check) {
      conditions.push('"check" = ?');
      params.push(check === "true" ? "true" : "false"); // 確保只將 'true' 或 'false' 作為參數
    }

    query += " WHERE " + conditions.join(" AND ");
  }

  // 執行查詢
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, files: rows });
  });
});

// 檔案上傳雲端
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const folderId = settings.GDrive_folderID;
  const fileName = req.body.uploadname;
  const filePath = req.file.path;

  authorize()
    .then((auth) => {
      uploadFile(auth, folderId, fileName, filePath)
        .then((fileId) => {
          // 在這裡調用 listFiles 函數以更新資料庫
          listFiles(auth, folderId)
            .then(() => {
              res.send({
                success: true,
                fileId: fileId,
                message: "File uploaded and database updated successfully.",
              });
            })
            .catch((error) => {
              console.error("Failed to update database:", error);
              // 即使更新資料庫失敗，也返回上傳成功的訊息
              res.send({
                success: true,
                fileId: fileId,
                message: "File uploaded but failed to update database.",
              });
            });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Failed to upload file to Google Drive.");
        });
    })
    .catch((error) => {
      console.error("Authorization failed:", error);
      res.status(500).send("Failed to authorize.");
    });
});

// 獲得雲端檔案列表
app.get("/api/list", (req, res) => {
  const folderId = settings.GDrive_folderID;

  authorize().then((auth) => {
    listFiles(auth, folderId)
      .then((files) => {
        res.send({ success: true, files: files });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to list files from Google Drive.");
      });
  });
});

// 檔案簽核
app.post("/api/checked", async (req, res) => {
  const { googleIds } = req.body;

  authorize()
    .then((auth) => {
      Promise.all(googleIds.map((fileId) => checkedFile(auth, fileId)))
        .then(() => listFiles(auth, settings.GDrive_folderID)) // 更新本地列表
        .then(() => {
          const query =
            'SELECT "googleId", "filename", "creater", "date" FROM files WHERE "check" = "false"';
          db.all(query, [], (err, rows) => {
            if (err) {
              console.error("從數據庫獲取文件時出錯：", err);
              return res.status(500).json({
                success: false,
                message: "從數據庫獲取文件時出錯",
              });
            }
            // 返回更新後的文件列表
            res.json({
              success: true,
              files: rows,
            });
          });
        })
        .catch((error) => {
          console.error("處理文件或更新列表時出錯：", error);
          res.status(500).json({
            success: false,
            message: "處理文件或更新列表時出錯",
          });
        });
    })
    .catch((authError) => {
      console.error("授權失敗：", authError);
      res.status(500).json({ success: false, message: "授權失敗" });
    });
});


// 自動雲端檔案刷新
setInterval(() => {
  const folderId = settings.GDrive_folderID;
  authorize().then((auth) => {
    listFiles(auth, folderId)
      .then((files) => console.log("Files listed"))
      .catch((error) => console.error("Failed to list files", error));
  });
}, 300000); // 5min

// 郵件提醒
function sendMail(callback) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const query = 'SELECT "email" FROM users WHERE "privilege" > 2';
  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }

    const receivers = rows.map((row) => row.email).join(", ");

    if (receivers) {
      var mailOptions = {
        from: process.env.MAILER,
        to: receivers, // 使用轉換後的接收者字串
        subject: "ELIMT System Information",
        html: "<h3>您有一份待簽核文件，請撥空查閱ELIMT電子系統。</h3><h3>You have a document to be signed, please check the ELIMT system.</h3>",
      };

      transporter.sendMail(mailOptions, callback);
    } else {
      console.log("No users with privilege > 1 found.");
    }
  });
}
setInterval(() => {
  const query = 'SELECT "googleId" FROM files WHERE "check" = "false"';
  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      // 如果有一或多個文件未檢查，則發送郵件
      sendMail((error, info) => {
        if (error) {
          console.log("Error sending mail: ", error);
        } else {
          console.log("Mail sent: ", info.response);
        }
      });
    }
  });
}, mailerinterval);

// 暫存檔案清除器
setInterval(() => {
  fs.readdir(uploadsFolder, (err, files) => {
    if (err) {
      console.error("Failed to read uploads folder:", err);
      return;
    }

    if (files.length > 5) {
      let oldestFile = files[0];
      let oldestFileDate = fs.statSync(uploadsFolder + oldestFile).ctime;
      for (let i = 1; i < files.length; i++) {
        const fileDate = fs.statSync(uploadsFolder + files[i]).ctime;
        if (fileDate < oldestFileDate) {
          oldestFile = files[i];
          oldestFileDate = fileDate;
        }
      }

      fs.unlink(uploadsFolder + oldestFile, (err) => {
        if (err) {
          console.error("Failed to delete file:", err);
          return;
        }
        console.log("File deleted successfully:", oldestFile);
      });
    }
  });
}, 6000000); // 100min


// 啟動服務器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});