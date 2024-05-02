import React, { useState, useEffect } from "react";
import {
  Typography,
  Divider,
  Drawer,
  List,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SettingsIcon from "@mui/icons-material/Settings";
import BookIcon from "@mui/icons-material/Book";

// 側邊欄項目
const categories = [
  {
    id: "Functions",
    children: [
      {
        id: "Profile",
        icon: <AccountBoxIcon />,
        privilegeLevel: 1,
      },
      {
        id: "LabBook",
        icon: <BookIcon />,
        privilegeLevel: 1,
      },
      {
        id: "LabBook Approval",
        icon: <CheckBoxIcon />,
        privilegeLevel: 2,
      },
      { id: "Links", icon: <PublicIcon />, privilegeLevel: 1 },
    ],
    privilegeLevel: 1,
  },
  {
    id: "System",
    children: [
      { id: "Users", icon: <PeopleIcon />, privilegeLevel: 2 },
      { id: "Settings", icon: <SettingsIcon />, privilegeLevel: 3 },
    ],
    privilegeLevel: 2,
  },
];

// 項目大小
const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

// 項目分類大小
const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

// 畫面輸出
export default function Navigator(props) {
  const { onItemSelect, ...other } = props;
  const [userInfo, setUserInfo] = useState({ privilege: 0 });
  const [activeItem, setActiveItem] = useState("null");

  useEffect(() => {
    //get userInfo from local storage
    const userInfoString = localStorage.getItem("user");
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      setUserInfo(userInfo);
    }
  }, []);

  //側邊欄點擊

  const handleItemClick = (id) => {
    setActiveItem(id);
    onItemSelect(id);
  };

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding sx={{ bgcolor: "#141414" }}>
        <ListItem
          sx={{
            ...item,
            ...itemCategory,
            fontSize: 22,
            color: "#5285DE",
            fontWeight: "bold",
            justifyContent: "center",
          }}
        >
          ELIMT
          <Typography
            sx={{
              fontSize: 10,
              ml: 0.5,
              mt: 0.9,
              color: "#fff",
            }}
          >
            v1.3.0
          </Typography>
        </ListItem>

        {categories
          .filter((category) => userInfo.privilege >= category.privilegeLevel) // 過濾類別級別
          .map(({ id, children, privilegeLevel }) => (
            <Box key={id} sx={{ bgcolor: "#1C1C1C" }}>
              <ListItem sx={{ py: 1, px: 3, bgcolor: "#1C1C1C" }}>
                <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
              </ListItem>
              {children
                .filter((child) => userInfo.privilege >= child.privilegeLevel) // 過濾子項目級別
                .map(({ id: childId, icon }) => (
                  <ListItem disablePadding key={childId}>
                    <ListItemButton
                      selected={activeItem === childId}
                      onClick={() => handleItemClick(childId)}
                      sx={item}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText>{childId}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))}
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
      </List>
    </Drawer>
  );
}
