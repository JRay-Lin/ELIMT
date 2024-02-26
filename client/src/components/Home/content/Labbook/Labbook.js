import React, { useState, useEffect } from "react";
import axios from "axios";
import PdfViewer from "./Pdfviewer";

import "./labbook.css";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Filelist from "./Uploadhistory";

function Labbook({ userInfo, tabIndex }) {
  const fullname = userInfo ? userInfo.fullname : "Unknown";
  const username = userInfo ? userInfo.username : "Unknown";
  const [experimentDetail, setExperimentDetail] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [openPop, setOpenPop] = useState(false);
  const [uploadname, setUploadname] = useState("");

  // 上傳檔案選擇
  const handleFileSelect = (file) => {
    setUploadFile(file);
  };

  // 上傳檔案名稱預處理
  const handleSubmit = (event) => {
    event.preventDefault();
    const today = new Date();
    const formattedDate = `${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
    const uploadname = `${formattedDate}-${username}-${fullname}-${experimentDetail}.pdf`;
    setUploadname(uploadname);
    setOpenPop(true);
  };

  // 確認視窗
  const handleConfirm = () => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("uploadname", uploadname);

    axios
      .post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Upload successful:", response.data);
        alert("File uploaded successfully!");
      })
      .catch((error) => {
        console.error("Upload error:", error);
        alert("Failed to upload file.");
      });
    setOpenPop(false);
    setUploadname("");
  };
  const handleClose = () => {
    setOpenPop(false);
  };

  // 獲取上傳資料
  const loadUpload = async () => {
    try {
      const response = await axios.get(`/api/files/?username=${username}`);
      setUploadHistory(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    loadUpload();

    const intervalId = setInterval(() => {
      loadUpload();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {tabIndex === 0 && (
        <Box component="form" onSubmit={handleSubmit} className="labbook">
          <Grid sx={{ mx: 4, my: 2 }}>
            <Grid container alignItems={"center"}>
              <Grid item xs={12}>
                <Grid
                  container
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Grid item>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", margin: 0, display: "flex" }}
                    >
                      <UploadFileIcon fontSize="large" sx={{ mr: 1 }} />{" "}
                      實驗記錄上傳
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      component="a"
                      href="https://docs.google.com/document/d/1vsBmcYMHDHo0BA_AmXprkDFd_IFY6qKrm50qy5Eg-30/edit?usp=share_link" // 目標 URL
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      下載範本
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="實驗簡述"
                  value={experimentDetail}
                  onChange={(e) => setExperimentDetail(e.target.value)}
                  InputProps={{
                    style: { color: "#C0C0C0" },
                  }}
                  InputLabelProps={{
                    style: { color: "#C0C0C0" },
                  }}
                  fullWidth
                  sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#2e2e2e",
                      },
                      "&:hover fieldset": {
                        borderColor: "secondary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sx={{ mb: 6, mt: 3 }}>
                <PdfViewer onFileSelect={handleFileSelect} />
              </Grid>

              <Grid item xs={12} container justifyContent={"center"}>
                <Button
                  className="submit-btn"
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ my: 2 }}
                >
                  提交
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Dialog open={openPop} onClose={handleClose}>
            {!uploadFile || !experimentDetail ? (
              <>
                <DialogTitle>{"輸入異常"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    請輸入實驗簡述或上傳檔案!
                  </DialogContentText>
                </DialogContent>
              </>
            ) : (
              <>
                <DialogTitle>{"確認提交"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    請確認您要提交的信息和檔案，檔案將以:
                  </DialogContentText>
                  <DialogContentText>
                    {uploadname} 儲存於Google Drive資料庫。
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    取消
                  </Button>
                  <Button onClick={handleConfirm} color="primary" autoFocus>
                    確認
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box sx={{ mx: 4, my: 2 }}>
          <Filelist items={uploadHistory} />
        </Box>
      )}
    </>
  );
}

export default Labbook;
