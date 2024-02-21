import React from "react";
import { Box, Button } from "@mui/material";

const websiteMap = {
  Google: ["https://www.google.com"],
  工時登錄系統: [
    "https://vwebap02.cmu.edu.tw/Plan_StuWorkAmt_Apply/login.aspx",
  ],
  實驗室計算工具: ["https://ylklabtools.fly.dev/#chemistry"],
  中醫大行事曆: ["https://president.cmu.edu.tw/calendar_109.html"],
};

export default function Links() {
  return (
    <Box sx={{ mx: 4, my: 2 }}>
      {Object.entries(websiteMap).map(([name, url]) => (
        <Button
          key={name}
          variant="contained"
          color="primary"
          href={url[0]}
          target="_blank"
          sx={{ mx: 2, my: 1 }}
        >
          {name}
        </Button>
      ))}
    </Box>
  );
}
