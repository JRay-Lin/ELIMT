import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Link,
} from "@mui/material";

function CheckableList({ items, checked, onToggle }) {
  // 無待簽核狀態
  if (items.length === 0) {
    return (
      <Typography
        variant="h5"
        fontWeight="bold"
        margin={2}
        textAlign={"center"}
      >
        目前無待簽核文件
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="checkable table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" sx={{ pt: 2, pl: 2 }}></TableCell>
            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
              Creater
            </TableCell>
            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
              Filename
            </TableCell>
            <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.googleId}
              hover
              role="checkbox"
              aria-checked={checked.indexOf(item.googleId) !== -1}
              tabIndex={-1}
              selected={checked.indexOf(item.googleId) !== -1}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={checked.indexOf(item.googleId) !== -1}
                  onChange={onToggle(item.googleId)}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                {item.fullname}
              </TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CheckableList;
