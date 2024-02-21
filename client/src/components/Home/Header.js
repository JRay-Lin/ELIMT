import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Avatar,
  Grid,
  IconButton,
  Link,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const lightColor = "rgba(255, 255, 255, 0.7)";

// 頁面內容
const tabMap = {
  Profile: ["Welcome", "Account"],
  "LabBook": ["Assignment", "History"],
  "LabBook Approval": ["Approval", "History"],
  Links: ["Website"],
  Settings: ["Settings"],
  Users: ["Users"],
};

function Header(props) {
  const { onDrawerToggle, activeItem, onTabChange, tabIndex } = props;

  const currentTabs = tabMap[activeItem] || tabMap["Profile"];
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [rotation, setRotation] = React.useState(0); 

  // 點擊計算器
  const handleIconClick = () => {
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount < 9) {
        setShowLogoutConfirm(true);
      } else {
        setOpenDialog(true);
      }
      return newCount;
    });
    setRotation((prevRotation) => prevRotation + 12);
  };

  // 處理登出確認對話框的關閉
  const handleCloseLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  // 處理特定對話框的關閉
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowLogoutConfirm(false); // 也關閉登出確認對話框以防萬一
    setClickCount(0); // 重置點擊次數
    setRotation(0);
  };

  // 登出處理
  const handleLogout = () => {
    fetch("/logout", {
      method: "GET",
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('登出失敗');
      }
    })
    .catch(error => {
      console.error('登出過程中發生錯誤', error);
    });
  };
  

  return (
    <React.Fragment>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0, bgcolor: "#171717" }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1} marginTop={0.5}>
            <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography color="#ffffff" variant="h5" component="h1">
                {activeItem || "Profile"}
              </Typography>
            </Grid>

            {/*Copyright Content */}
            <Grid item>
              <Link
                href="https://github.com/JRay9487/ELIMT"
                variant="body2"
                sx={{
                  textDecoration: "none",
                  color: lightColor,
                  "&:hover": {
                    color: "common.white",
                  },
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                Go to docs
              </Link>
            </Grid>
            {/*Copyright Content */}

            <Grid item>
              <IconButton
                color="inherit"
                onClick={handleIconClick}
                sx={{ p: 0.5 }}
              >
                <Avatar
                  src="flask.webp"
                  alt="Web Avatar"
                  sx={{ transform: `rotate(${rotation}deg)` }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* sec-nav */}
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0, bgcolor: "#171717" }}
      >
        <Tabs value={tabIndex} textColor="inherit">
          {currentTabs.map((label, index) => (
            <Tab
              key={index}
              label={label}
              onClick={() => {
                onTabChange(index);
              }}
              sx={{
                color: "#ffffff",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#ffffff",
                },
              }}
            />
          ))}
        </Tabs>
      </AppBar>
      {/* 登出介面*/}
      <Dialog open={showLogoutConfirm} onClose={handleCloseLogoutConfirm}>
        <DialogTitle>{"確定要登出嗎？"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseLogoutConfirm} color="primary">
            取消
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            確定
          </Button>
        </DialogActions>
      </Dialog>
      {/* 特定對話框*/}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"恭喜你把實驗室炸了!"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 14 }}>
            就說別亂玩化學品吧
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            好的
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
  activeItem: PropTypes.oneOfType([PropTypes.string]),
};

export default Header;
