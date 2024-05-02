import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Link,
  Grid,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

export default function Filelist({ items }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handlesearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (items.length === 0) {
    return (
      <Typography variant="h5" fontWeight="bold" margin={2} textAlign="center">
        無上傳歷史紀錄
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <SearchIcon color="secondary" sx={{ display: "block" }} />
        </Grid>
        <Grid item xs>
          <TextField
            variant="standard"
            fullWidth
            placeholder="Search by filename"
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
      <Table aria-label="upload history">
        <TableHead>
          <TableRow>
            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
              Filename
            </TableCell>
            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
              Time
            </TableCell>
            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
              status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.googleId}>
              <TableCell>
                <Link
                  href={`https://drive.google.com/file/d/${item.googleId}/view?usp=drive_link`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.filename}
                </Link>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.status} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
