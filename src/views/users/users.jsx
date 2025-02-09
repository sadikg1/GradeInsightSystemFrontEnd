import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserCard from "../../ui-component/cards/UsersCard.jsx";
import MainCard from "../../ui-component/cards/MainCard";
import { HiUserAdd } from "react-icons/hi";

import UsersProfile from "./usersprofile";
import DeleteModal from "modal/DeleteModal";
import { getData, postData, putData } from "apiHandler/apiHandler";
import showToast from "toastMessage/showToast.jsx";
// import showToast from 'ToastMessage/showToast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteId, setDeleteId] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [Loader, setLoader] = useState(false);

  const fetchData = async () => {
    setLoader(true);
    try {
      const [usersResponse, userTypesResponse] = await Promise.all([
        getData("/Users"),
        getData("/UserTypes"),
      ]);
      setUsers(usersResponse.data);
      setUserTypes(userTypesResponse.data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUserTypeName = (userTypeId) => {
    const userType = userTypes.find((type) => type.userTypeId === userTypeId);
    return userType ? userType.userTypeName : "Unknown";
  };

  const handleDialogOpen = (user = null) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(false);
    }
  };

  const handleEdit = (id) => {
    const user = users.find((user) => user.userId === id);
    handleDialogOpen(user);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Find userType object from userTypeName
      const userType = userTypes.find(
        (type) => type.userTypeName === values.userTypeName
      );
  
      if (!userType) {
        throw new Error("Invalid user type selected");
      }
  
      const payload = {
        userTypeId: userType.userTypeId, // Ensure correct userTypeId
        userName: values.userName,
        userFullName: values.userFullName,
        userEmail: values.userEmail,
      };
  
      if (currentUser) {
        // Update existing user
        await putData(`/Users/${currentUser.userId}`, {
          ...payload,
          userId: values.userId,
        });
  
        const updatedUsers = await getData("/Users"); // Refresh user data
        setUsers(updatedUsers.data);
        showToast("success", "User updated successfully");
      } else {
        // Create new user
        const response = await postData("/Users", payload, {
          userPassword: values.newPassword,
        });
        setUsers([...users, response.data]);
        showToast("success", "User created successfully");
      }
  
      setOpen(false);
      resetForm();
    } catch (error) {
      showToast("error", "Error saving User information. Please try again.");
    }
  };
  
  const handlePasswordChange = async (values, { resetForm }) => {
    try {
      const headers = {
        userPassword: values.newPassword,
      };

      const payload = {
        userId: currentUser.userId,
        userTypeId: currentUser.userTypeId,
        userName: currentUser.userName,
        userFullName: currentUser.userFullName,
        userEmail: currentUser.userEmail,
      };

      await putData(`/Users/${currentUser.userId}`, payload, headers);
      // showToast("success",User's password updated successfully)
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        height: "100%",
        border: "2px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <MainCard
          title={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h3">All Users</Typography>
              <Button
                variant="contained"
                color="primary"
                endIcon={<HiUserAdd />}
                onClick={() => handleDialogOpen()}
              >
                User Records
              </Button>
            </Box>
          }
          sx={{ padding: 2 }}
        >
          {Loader ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {users.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user.userId}>
                  <UserCard
                    id={user.userId}
                    fullName={user.userFullName}
                    username={user.userName}
                    email={user.userEmail}
                    department={getUserTypeName(user.userTypeId)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </MainCard>
      </Box>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4">
              {currentUser ? "Edit User" : "Add User"}
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: "16px" }}>
          <UsersProfile
            initialValues={{
              userId: currentUser?.userId || "",
              userName: currentUser?.userName || "",
              userFullName: currentUser?.userFullName || "",
              userEmail: currentUser?.userEmail || "",
              userTypeName: currentUser
                ? getUserTypeName(currentUser.userTypeId)
                : "",
            }}
            userTypes={userTypes}
            onSubmit={handleSubmit}
            onPasswordChange={handlePasswordChange}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <DeleteModal
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDeleteCardId={deleteId}
        name="users"
        messageName="User"
        fetchData={fetchData}
        showToast={showToast}
      />
    </Paper>
  );
};

export default Users;
