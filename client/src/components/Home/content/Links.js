import React, {useState}  from "react";
import { Box, Button } from "@mui/material";

export default function Links({ userInfo }) {
    const websiteMap = userInfo.link;
    
    return (
        <Box sx={{ mx: 4, my: 2 }}>
            {Object.entries(websiteMap).map(([name, url]) => (
                <Button
                    key={name}
                    variant="contained"
                    color="primary"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mx: 2, my: 1 }}
                >
                    {name}
                </Button>
            ))}
        </Box>
    );
}
