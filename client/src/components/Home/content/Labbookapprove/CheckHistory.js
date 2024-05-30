import React, { useState } from "react";
import {
    Box,
    Paper,
    Grid,
    TextField,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function CheckHistory({ history }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handlesearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Define a function for sorting by date
    const sortItemsByDate = (a, b) => {
        // Assuming date format is YYYY-MM-DD, you can convert to date objects to compare
        return new Date(b.date) - new Date(a.date);
    };

    // Sort history first, then filter
    const sortedHistory = history.sort(sortItemsByDate);
    const filteredItems = sortedHistory.filter(
        (item) =>
            item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ mx: 4, my: 2 }}>
            <Box sx={{ backgroundColor: "#1E1E1E" }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <SearchIcon
                            color="secondary"
                            sx={{ display: "block" }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            variant="standard"
                            fullWidth
                            placeholder="Search by filename or creater"
                            InputLabelProps={{
                                style: { color: "#C0C0C0" },
                            }}
                            InputProps={{
                                disableUnderline: true,
                                style: { color: "#C0C0C0" },
                                sx: { fontSize: "default" },
                            }}
                            onChange={handlesearch}
                        />
                    </Grid>
                </Grid>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 600,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        width: "3px",
                        border: "30px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent", // Scrollbar track color
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#FFFFFF8B", // Scrollbar handle color
                        borderRadius: "10px",
                    },
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
                                Creater
                            </TableCell>
                            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
                                Filename
                            </TableCell>
                            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
                                Date
                            </TableCell>
                            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredItems.map((history) => (
                            <TableRow key={history.googleId}>
                                <TableCell>{history.fullname}</TableCell>
                                <TableCell>
                                    <Link
                                        href={`https://drive.google.com/file/d/${history.googleId}/view?usp=drive_link`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {history.filename}
                                    </Link>
                                </TableCell>
                                <TableCell>{history.date}</TableCell>
                                <TableCell>{history.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
