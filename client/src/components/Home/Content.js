import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";

// Contents
import Profile from "./content/Profile";
import Labbook from "./content/Labbook/Labbook";
import LBapprove from "./content/Labbookapprove/LBapprove";
import Links from "./content/Links";
import Users from "./content/Users";
import Settings from "./content/Settings";

export default function Content(props) {
  const { activeItem, tabIndex } = props;

  //get userInfo from local storage
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const userInfoString = localStorage.getItem("user");
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      setUserInfo(userInfo);
    }
  }, []);

  // tabindex

  const renderContentComponent = () => {
    switch (activeItem) {
      case "Profile":
        return <Profile userInfo={userInfo} tabIndex={tabIndex} />;
      case "LabBook":
        return <Labbook userInfo={userInfo} tabIndex={tabIndex} />;
      case "LabBook Approval":
        return <LBapprove userInfo={userInfo} tabIndex={tabIndex} />;
      case "Links":
        return <Links userInfo={userInfo} tabIndex={tabIndex} />;
      case "Settings":
        return <Settings userInfo={userInfo} tabIndex={tabIndex} />;
      case "Users":
        return <Users userInfo={userInfo} tabIndex={tabIndex} />;
      default:
        return <Profile userInfo={userInfo} tabIndex={tabIndex} />;
    }
  };

  return (
    <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
      {renderContentComponent()}
    </Paper>
  );
}
