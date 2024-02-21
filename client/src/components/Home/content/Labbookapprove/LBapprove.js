import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Box,
  AppBar,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  DialogContentText,
} from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";

import CheckableList from "./CheckableList";
import CheckHistory from "./CheckHistory";

export default function LBapprove({ tabIndex }) {
  const [fileList, setFileList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [checked, setChecked] = useState([]);
  const [open, setOpen] = useState(false);

  // checkbox
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // Dialog
  const handleApprove = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // 取得待簽核資料
  const loadcheck = async () => {
    try {
      const response = await axios.get("/api/files/?check=false");
      setFileList(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

   // 簽核歷史紀錄
   const loadHistory = async () => {
    try {
      const response = await axios.get("/api/files/?check=true");
      const filteredFiles = response.data.files.filter(file => file.filename !== "SystemTest.pdf");
      setHistoryList(filteredFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // 刷新資料
  useEffect(() => {
    loadcheck();
    loadHistory();
  
    const intervalId = setInterval(() => {
      loadcheck();
      loadHistory();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []); 

  // 簽核功能
  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/checked", {
        googleIds: checked,
      });
      console.log("res", response.data);
      alert("檔案簽核成功!");
      setChecked([]);
      loadcheck();
    } catch (error) {
      console.error("err", error);
      alert("檔案簽核失敗!");
    }
    setOpen(false);
  };

  return (
    <>
      {tabIndex === 0 && (
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
          <Box sx={{mx:4 , my:2}}>
            <AppBar
              position="static"
              color="transparent"
              elevation={0}
              sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <Grid sx={{pl:0}}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <ChecklistIcon
                      color="secondary"
                      fontSize="large"
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">簽核系統</Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={handleApprove}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </AppBar>
            <CheckableList
              items={fileList}
              checked={checked}
              onToggle={handleToggle}
            />
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>確認簽核</DialogTitle>
              <DialogContent>
                <DialogContentText>以下文件將被簽核通過：</DialogContentText>
                <DialogContentText>
                  {checked.length > 0 ? (
                    checked.map((id) => {
                      const item = fileList.find(
                        (item) => item.googleId === id
                      );
                      return (
                        <div key={id}>
                          {item ? item.filename : "未找到檔案"}
                        </div>
                      );
                    })
                  ) : (
                    <div>未選擇任何檔案</div>
                  )}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                >
                  取消
                </Button>

                <Button
                  onClick={() => {
                    handleSubmit();
                    setOpen(false);
                  }}
                >
                  確認
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
          <CheckHistory history={historyList} />
        </Paper>
      )}
    </>
  );
}
