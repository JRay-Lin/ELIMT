import React, { useState } from "react";
import { Typography, Box, TextField, Grid, Button } from "@mui/material";

export default function Settings({ userInfo }) {
  let [folderID, setFolderID] = useState("");
  let [uploadSize, setUploadsize] = useState()

  const handleSave = () => {
    if (userInfo && userInfo.settings) {
      folderID = folderID === "" ? userInfo.settings.folder : folderID;

      console.log(folderID);
    } else {
      console.log("userInfo 或 userInfo.settings 未定義");
    }
  };

  return (
    <Box sx={{ mx: 4, my: 2 }}>
      <Grid container sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ mt: 0.4, mr: 1 }}>
          GoogleDrive Folder :
        </Typography>
        <TextField
          fullWidth
          variant="standard"
          placeholder={userInfo.settings.folder}
          onChange={(e) => setFolderID(e.target.value)}
          sx={{
            "& .MuiInput-underline:before": {
              borderBottomColor: "#2e2e2e",
            },
            "&:hover .MuiInput-underline:before": {
              borderBottomColor: "#FFFFFF !important",
            },
          }}
          InputProps={{
            disableUnderline: false,
            sx: { fontSize: 20 },
            style: { color: "#C0C0C0", borderColor: "#2e2e2e" },
          }}
        />
      </Grid>
      <Grid container sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ mt: 0.4, mr: 1 }}>
          Upload Size (mb) :
        </Typography>
        <TextField
          fullWidth
          variant="standard"
          placeholder={userInfo.settings.maximum_uploadSize}
          onChange={(e) => setUploadsize(e.target.value)}
          sx={{
            "& .MuiInput-underline:before": {
              borderBottomColor: "#2e2e2e",
            },
            "&:hover .MuiInput-underline:before": {
              borderBottomColor: "#FFFFFF !important",
            },
          }}
          InputProps={{
            disableUnderline: false,
            sx: { fontSize: 20 },
            style: { color: "#C0C0C0", borderColor: "#2e2e2e" },
          }}
        />
      </Grid>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={handleSave}
      >
        儲存
      </Button>
    </Box>
  );
}
