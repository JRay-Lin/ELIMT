import React, {useState} from "react";
import { Typography, Box, Grid, TextField, Button } from "@mui/material";
import axios from "axios";

export default function Profile({ userInfo, tabIndex }) {
  const username = userInfo ? userInfo.username : "XXXXXXX";
  const role = userInfo
    ? userInfo.privilege === "3"
      ? "系統管理員"
      : userInfo.privilege === "2"
      ? "老師"
      : "學生"
    : "unknown";
  const position = userInfo 
    ? userInfo.privilege === "3"
      ? ""
      : userInfo.privilege === "2"
      ? "老師"
      : "同學"
    : "unknown";
  const [password, setPassword] = useState("");
  const [email, setEmail] =useState("");
  const [fullname, setFullname] =useState("");

  const handleSave = async () => {
    const userData = {
      username, 
      fullname,
      email,
      password
    };
  
    try {
      const response = await axios.post("/api/account/?modify=update", userData);
      console.log(response.data); 
    } catch (error) {
      console.error(error); 
    };
    alert("修改成功!");
  };

  return (
    <>
      {tabIndex === 0 && (
        <Typography variant="h5" fontWeight="bold" sx={{ mx: 4, my: 2 }}>
          您好, {userInfo.fullname} {position}
        </Typography>
      )}
      {tabIndex === 1 && (
        <Box sx={{ mx: 4, my: 2 }}>
          <Grid container>
            <Grid container>
              <Typography variant="h6" sx={{ mt: 0.4, mr: 1, width:100 }}>
                Role
              </Typography><Typography variant="h6" sx={{ mt: 0.4, mr: 1 }}>:</Typography>
              <TextField
                variant="standard"
                size="large"
                placeholder={role}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 20 },
                  style: { color: "#C0C0C0" },
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid container>
              <Typography variant="h6" sx={{ mt: 0.4, mr: 1, width:100 }}>
                Account
              </Typography><Typography variant="h6" sx={{ mt: 0.4, mr: 1 }}>:</Typography>
              <TextField
                variant="standard"
                size="large"
                placeholder={username}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 20 },
                  style: { color: "#C0C0C0" },
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid container>
              <Typography variant="h6" sx={{ mt: 0.4, mr: 1, width:100 }}>
                Username
              </Typography><Typography variant="h6" sx={{ mt: 0.4, mr: 1 }}>:</Typography>
              <TextField
                variant="standard"
                size="large"
                placeholder={userInfo.fullname}
                onChange={(e) => setFullname(e.target.value)}
                InputProps={{
                  disableUnderline: false,
                  sx: { fontSize: 20 },
                  style: { color: "#C0C0C0" },
                  readOnly: false,
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#2e2e2e",
                  },
                  "&:hover .MuiInput-underline:before": {
                    borderBottomColor: "#ffffff !important",
                  },
                }}
              />
            </Grid>

            <Grid container>
              <Typography variant="h6" sx={{ mt: 0.4, mr: 1, width:100 }}>
                Email
              </Typography><Typography variant="h6" sx={{ mt: 0.4, mr: 1 }}>:</Typography>
              <TextField
                variant="standard"
                style = {{width: 360}}
                placeholder={userInfo.email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#2e2e2e",
                  },
                  "&:hover .MuiInput-underline:before": {
                    borderBottomColor: "#ffffff !important",
                  },
                }}
                InputProps={{
                  disableUnderline: false,
                  sx: { fontSize: 20 },
                  style: { color: "#C0C0C0" },
                }}
              />
            </Grid>
            <Grid container>
              <Typography variant="h6" sx={{ mt: 0.4, mr: 1, width:100 }}>
                Password
              </Typography><Typography variant="h6" sx={{ mt: 0.4, mr: 1 }}>:</Typography>
              <TextField
                variant="standard"
                placeholder="********"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#2e2e2e",
                  },
                  "&:hover .MuiInput-underline:before": {
                    borderBottomColor: "#ffffff !important",
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
              type="submit"
              variant="contained"
              color="primary"
              sx={{ my: 2 }}
              onClick={handleSave}
            >
              儲存
            </Button>
          </Grid>
        </Box>
      )}
    </>
  );
}
