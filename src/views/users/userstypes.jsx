import {
  Button,
  Grid,
  IconButton,
  Modal,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  TablePagination,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";

import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { visuallyHidden } from "@mui/utils";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaSearch } from "react-icons/fa";
import showToast from "ToastMessage/showToast";
import { getData, putData } from "apiHandler/apiHandler";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: "10px",
};

const validationSchema = Yup.object().shape({
  userTypeName: Yup.string().max(100).required("User Type is required"),
});

const UserType = () => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [initialValues, setInitialValues] = useState({ userTypeName: "" });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("userTypeName");

  const handleClose = () => {
    setOpen(false);
    setInitialValues({ userTypeName: "" });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getData("/userTypes");
      setUserTypes(res.data);
    } catch (err) {
      showToast("error", "Error fetching data!");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editCardId) {
        await putData(`/userTypes/${editCardId}`, {
          ...values,
          userTypeId: editCardId,
        });
        showToast("success", "User Type updated successfully!");
      }
      fetchData();
      handleClose();
    } catch (err) {
      showToast("error", "Error updating User Type!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (id, name) => {
    setEditCardId(id);
    setOpen(true);
    setInitialValues({ userTypeName: name });
  };

  const alphabeticalComparator = (a, b) => {
    if (a.userTypeName < b.userTypeName) return -1;
    if (a.userTypeName > b.userTypeName) return 1;
    return 0;
  };

  const sortedUserTypes = [...userTypes].sort((a, b) => {
    if (orderBy === "userTypeName") {
      return order === "asc"
        ? alphabeticalComparator(a, b)
        : alphabeticalComparator(b, a);
    }
    return 0;
  });

  const filteredUserTypes = sortedUserTypes.filter((userType) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return userType.userTypeName.toLowerCase().includes(lowerCaseSearchTerm);
  });

  useEffect(() => {
    fetchData();
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      document.getElementById("searchInput").focus();
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        height: "100%",
        padding: "15px",
        border: '2px solid #ccc',
        borderRadius: '10px'
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "13px",
          marginRight: "15px",
        }}
      >
        <div>
          <Typography
            style={{ marginLeft: "20px", marginTop: "10px" }}
            fontWeight="bold"
            variant="h3"
          >
            User Type Records
          </Typography>
          <div style={{ marginLeft: "20px", marginTop: "7px" }}>
            Total User Types: {userTypes.length}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{ position: "relative", marginRight: "40px", height: "0px" }}
          >
            <input
              id="searchInput"
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                height: "35px",
                width: isExpanded ? "215px" : "0px",
                borderRadius: "10px",
                border: "1px solid gray",
                paddingLeft: "15px",
                transition: "width 0.3s ease, opacity 0.3s ease",
                opacity: isExpanded ? "1" : "0",
                paddingRight: "40px",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #1d396e",
                background: "#1d396e",
                padding: "5px",
                position: "absolute",
                right: "0px",
                top: "17px",
                transform: "translateY(-50%)",
                width: "36px",
                height: "35px",
                borderRadius: "10px",
                zIndex: 1,
              }}
            >
              <FaSearch
                onClick={toggleExpand}
                style={{
                  cursor: "pointer",
                  color: "white",
                  width: "15px",
                  height: "15px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <TableContainer
        sx={{ maxHeight: "59vh", minHeight: "410px", padding: "20px" }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ paddingLeft: "10px" }}>
                <TableSortLabel
                  active={orderBy === "userTypeName"}
                  direction={orderBy === "userTypeName" ? order : "asc"}
                  onClick={() => handleRequestSort("userTypeName")}
                >
                  Name
                  {orderBy === "userTypeName" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ paddingRight: "50px" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUserTypes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover key={row.userTypeId}>
                  <TableCell sx={{ paddingLeft: "10px" }}>
                    {row.userTypeName}
                  </TableCell>
                  <TableCell align="right" sx={{ paddingRight: "50px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={
                          <FaEdit size={15} style={{ color: "#2397F3" }} />
                        }
                        sx={{
                          color: "#2397F3",
                          borderColor: "#2397F3",
                          "&:hover": {
                            borderColor: "#2397F3",
                            color: "#2397F3",
                          },
                          marginRight: 1,
                          fontSize: "0.75rem",
                          padding: "4px 8px",
                        }}
                        onClick={() =>
                          handleEdit(row.userTypeId, row.userTypeName)
                        }
                      >
                        Edit
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredUserTypes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ marginBottom: "20px" }}
          >
            Edit User Type
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="userTypeName"
                      label="User Type Name"
                      fullWidth
                      error={
                        touched.userTypeName && Boolean(errors.userTypeName)
                      }
                      helperText={touched.userTypeName && errors.userTypeName}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "right" }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      onClick={handleClose}
                      sx={{ marginRight: "8px", background: "#808080" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ background: "#1d396e" }}
                      disabled={isSubmitting}
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </Paper>
  );
};

export default UserType;
