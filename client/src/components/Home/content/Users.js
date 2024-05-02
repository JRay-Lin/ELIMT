import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Account() {
  const [userList, setUserList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", privilege: "" });
  const [usernameToDelete, setUsernameToDelete] = useState("");

  const loadUser = async () => {
    try {
      const response = await axios.get("/api/account/list");
      setUserList(response.data.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    loadUser();

    const intervalId = setInterval(() => {
      loadUser();
    }, 10000);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.privilege) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/account/?modify=insert", newUser);

      if (response.data.success) {
        alert("User added successfully:", response.data.message);
      } else {
        alert("Failed to add user:", response.data.error);
      }
      loadUser();
    } catch (error) {
      console.error("Error while adding user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!usernameToDelete) {
      alert("Please enter a username.");
      return;
    };
    if (usernameToDelete === "admin") {
      alert("Cannot delete admin user.");
      return;
    };
    try {
      const response = await axios.post(`/api/account/?modify=delete`, {
        username: usernameToDelete,
      });
      if (response.data.success) {
        alert("User deleted successfully");
        loadUser();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error while deleting user:", error);
    }
  };

  return (
    <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
      <Grid sx={{ mx: 4, my: 2 }}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{
            backgroundColor: "#1E1E1E",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Grid sx={{ backgroundColor: "#1E1E1E" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <ManageAccountsIcon
                  color="secondary"
                  sx={{ display: "block" }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h6">帳號管理</Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ mr: 1 }}
                  onClick={handleOpenDialog}
                >
                  Add user
                </Button>
                <Button
                  variant="contained"
                  sx={{ mr: 0 ,':hover':{bgcolor:"#FF6464"}}}
                  onClick={handleOpenDeleteDialog}
                >
                  <DeleteIcon />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </AppBar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
                  Username
                </TableCell>
                <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
                  Fullname
                </TableCell>
                <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
                  Email
                </TableCell>
                <TableCell padding="none" sx={{ pt: 2, pl: 2 }}>
                  Role
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.privilege === "3"
                      ? "系統管理員"
                      : user.privilege === "2"
                      ? "老師"
                      : user.privilege === "1"
                      ? "學生"
                      : "unknown"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add user</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="username"
              label="Username"
              type="text"
              InputProps={{
                style: { color: "#C0C0C0" },
              }}
              InputLabelProps={{
                style: { color: "#C0C0C0" },
              }}
              fullWidth
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#2e2e2e",
                  },
                  "&:hover fieldset": {
                    borderColor: "secondary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
              variant="outlined"
              value={newUser.username}
              onChange={handleInputChange}
            />
            <TextField
              select
              label="Role"
              name="privilege"
              fullWidth
              value={newUser.privilege}
              onChange={handleInputChange}
              InputProps={{
                style: { color: "#C0C0C0" },
              }}
              SelectProps={{
                style: { color: "#C0C0C0" },
              }}
              InputLabelProps={{
                style: { color: "#C0C0C0" },
              }}
              sx={{
                mt: 2,
                minWidth: 80,
                "& .MuiSvgIcon-root": {
                  color: "#C0C0C0",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#2e2e2e",
                  },
                  "&:hover fieldset": {
                    borderColor: "secondary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            >
              <MenuItem sx={{ color: "#FFFFFF" }} value="1">
                Student
              </MenuItem>
              <MenuItem sx={{ color: "#FFFFFF" }} value="2">
                Teacher
              </MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button onClick={() => {
                handleAddUser();
                handleCloseDialog();
              }}>確認</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete user</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              name="username"
              label="Username"
              type="text"
              fullWidth
              value={usernameToDelete}
              onChange={(e) => setUsernameToDelete(e.target.value)}
              InputProps={{
                style: { color: "#C0C0C0" },
              }}
              InputLabelProps={{
                style: { color: "#C0C0C0" },
              }}
              sx={{
                mt: 0.6,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#2e2e2e",
                  },
                  "&:hover fieldset": {
                    borderColor: "secondary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button
              onClick={() => {
                handleDeleteUser();
                handleCloseDeleteDialog();
              }}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Paper>
  );
}
