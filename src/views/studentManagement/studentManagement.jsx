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
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { Field, Form, Formik } from "formik";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { visuallyHidden } from "@mui/utils";
import DeleteModal from "modal/DeleteModal";
import { getData, postData, putData } from "apiHandler/apiHandler";
import showToast from "toastMessage/showToast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  height: "auto",
  bgcolor: "background.paper",
  p: 4,
  borderRadius: "10px",
};

const StudentManagement = () => {
  
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [student, setStudent] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [semester, setSemester] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    studentName: "",
    facultyId: "",
    semesterId: "",
    address: "",
    contactNo: "",
  });

  // function for closing modal
  const handleClose = () => {
    setOpen(false);
    setInitialValues({
      studentName: "",
      facultyId: "",
      semesterId: "",
      address: "",
      contactNo: "",
    });
  };

  // function for opening modal
  const handleClickOpen = () => {
    setIsEdit(false);
    setOpen(true);
    setInitialValues({
      studentName: "",
      facultyId: "",
      semesterId: "",
      address: "",
      contactNo: "",
    });
  };

  // function for getting the data
  const fetchData = async () => {
    setLoading(true);
    try {
      await getData("/students").then((res) => setStudent(res.data));
      await getData("/faculties").then((res) => setFaculty(res.data));
      await getData("/semesters").then((res) => setSemester(res.data));
    } catch (err) {
      console.log("Error is:", err);
    }
    setLoading(false);
  };
  const alphabeticalComparator = (a, b) => {
    if (a.studentName < b.studentName) return -1;
    if (a.studentName > b.studentName) return 1;
    return 0;
  };
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("studentName");
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const sortedService = [...student].sort((a, b) => {
    if (orderBy === "studentName") {
      return order === "asc"
        ? alphabeticalComparator(a, b)
        : alphabeticalComparator(b, a);
    }
    return 0;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    studentName: Yup.string().max(100).required("Student Name is required"),
    address: Yup.string().max(100).required("Address is required"),
    contactNo: Yup.string()
      .matches(
        /^[0-9]{7}$|^[0-9]{10}$/,
        "Contact Number must be 7 or 10 digits"
      )
      .required("Contact Number is required"),
    facultyId: Yup.string().max(100).required("Faculty Name is required"),
    semesterId: Yup.string().max(100).required("Semester Name is required"),
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // Submitting the form
  const handleSubmit = async (values) => {
    try {
      if (isEdit && editCardId) {
        await putData(`/students/${editCardId}`, {
          ...values,
          studentId: editCardId,
        });
        showToast("success", "Successfully updated Student");
      } else {
        await postData("/students", values);
        showToast("success", "Successfully added Student");
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.log(err);
      showToast("error", "Error adding student");
    }
  };

  const handleEdit = (id, facultyId, semesterId, name, address, contactNo) => {
    setIsEdit(true);
    setEditCardId(id);
    setOpen(true);
    setInitialValues({
      studentName: name,
      facultyId: facultyId,
      semesterId: semesterId,
      address: address,
      contactNo: contactNo,
    });
  };

  // Delete Service Card
  const handleDelete = (id) => {
    setDeleteCardId(id);
    setDeleteModalVisible(true);
  };
  const filteredService = sortedService.filter((student) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return student.studentName.toLowerCase().includes(lowerCaseSearchTerm);
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      document.getElementById("searchInput").focus(); // Focus the input when expanding
    }
  };
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        height: "100%",
        paddingLeft: "15px",
        paddingRight: "15px",
        border: "2px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "13px",
          marginRight: "10px",
        }}
      >
        <div>
          <Typography
            style={{ marginLeft: "20px", marginTop: "10px" }}
            fontWeight="bold"
            variant="h3"
          >
            Student Records
          </Typography>
          <div style={{ marginLeft: "20px", marginTop: "7px" }}>
            Total Student:{student.length}
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
                width: isExpanded ? "215px" : "0px", // Control width based on state
                borderRadius: "10px",
                border: "1px solid gray",
                paddingLeft: "15px", // Padding for the text
                transition: "width 0.3s ease, opacity 0.3s ease", // Smooth transition
                opacity: isExpanded ? "1" : "0", // Fade effect
                paddingRight: "40px", // Add right padding to avoid text overlap with the icon
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #1d396e",
                background: "#1d396e", // Red border around the icon
                padding: "5px", // Adds space around the icon
                position: "absolute", // Make the position absolute
                right: "0px", // Position it inside the input
                top: "17px", // Center vertically
                transform: "translateY(-50%)", // Adjust for perfect centering
                width: "36px",
                height: "35px",
                borderRadius: "10px", // Rounded corners
                zIndex: 1, // Ensure it stays above the input
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
          <Button
            variant="contained"
            style={{ background: "primary", height: "40px" }}
            onClick={handleClickOpen}
          >
            Add Student
          </Button>
        </div>
      </div>
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
            variant="h2"
            component="h2"
            style={{ marginBottom: "50px" }}
          >
            {isEdit ? "Edit Student Registration" : "Student Registration"}
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ errors, touched, values, handleChange, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="studentName"
                      label="Student Name"
                      fullWidth
                      error={touched.studentName && Boolean(errors.studentName)}
                      helperText={touched.studentName && errors.studentName}
                      variant="filled"
                      style={{
                        height: "50px",
                        marginTop: "10px",
                        borderRadius: "10px",
                      }}
                    />
                    <Field
                      as={TextField}
                      name="address"
                      label="Address"
                      fullWidth
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                      variant="filled"
                      style={{
                        height: "50px",
                        marginTop: "25px",
                        borderRadius: "10px",
                      }}
                    />
                    <Field
                      as={TextField}
                      name="contactNo"
                      label="Contact Number"
                      fullWidth
                      error={touched.contactNo && Boolean(errors.contactNo)}
                      helperText={touched.contactNo && errors.contactNo}
                      variant="filled"
                      style={{
                        height: "50px",
                        marginTop: "25px",
                        borderRadius: "10px",
                      }}
                    />

                    <TextField
                      select
                      id="facultyId"
                      label="Faculty Name"
                      name="facultyId"
                      variant="filled"
                      required
                      value={values.facultyId}
                      fullWidth
                      onChange={handleChange}
                      style={{
                        height: "50px",
                        marginTop: "25px",
                        borderRadius: "10px",
                      }}
                    >
                      <MenuItem disabled>Select Faculty</MenuItem>
                      {faculty.map((item, i) => (
                        <MenuItem value={item.facultyId} key={i}>
                          {item.facultyName}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      id="semesterId"
                      label="Semester Name"
                      name="semesterId"
                      variant="filled"
                      required
                      value={values.semesterId}
                      fullWidth
                      onChange={handleChange}
                      style={{
                        height: "50px",
                        marginTop: "25px",
                        borderRadius: "10px",
                      }}
                      disabled={!values.facultyId} // Disable if no faculty is selected
                    >
                      <MenuItem disabled>Select Semester</MenuItem>
                      {semester
                        .filter((item) => item.facultyId === values.facultyId) // Filter based on selected faculty
                        .map((item, i) => (
                          <MenuItem value={item.semesterId} key={i}>
                            {item.semesterName}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        handleClose();
                      }}
                      style={{ marginRight: "8px", background: "#808080" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ background: "primary" }}
                      disabled={isSubmitting}
                    >
                      {isEdit ? "Update" : "Submit"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          sx={{ maxHeight: "59vh", minHeight: "410px" }}
          style={{ paddingRight: "20px", paddingLeft: "20px" }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ paddingLeft: "10px" }}>
                  <TableSortLabel
                    active={orderBy === "studentName"}
                    direction={orderBy === "studentName" ? order : "asc"}
                    onClick={() => handleRequestSort("studentName")}
                  >
                    Student Name
                    {orderBy === "studentName" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Faculty</TableCell>
                <TableCell align="center">Semester</TableCell>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">Contact Number</TableCell>

                <TableCell align="center">Creation Date</TableCell>
                <TableCell align="right" style={{ paddingRight: "50px" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredService
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover key={row.studentId}>
                    <TableCell style={{ paddingLeft: "10px" }}>
                      {row.studentName}
                    </TableCell>

                    <TableCell align="center">
                      {row.faculty.facultyName}
                    </TableCell>
                    <TableCell align="center">
                      {row.semester.semesterName}
                    </TableCell>
                    <TableCell align="center">{row.address}</TableCell>
                    <TableCell align="center">{row.contactNo}</TableCell>

                    <TableCell align="center">
                      {row.dateCreated.split("T")[0]}
                    </TableCell>
                    <TableCell align="right" style={{ paddingRight: "5px" }}>
                      <Button
                        variant="outlined"
                        startIcon={
                          <FaEdit size={15} style={{ color: "#2397F3" }} />
                        }
                        sx={{
                          color: "#2397F3",
                          borderColor: "#2397F3",
                          "&:hover": { borderColor: "#2397F3", color: "#2397F3" },
                          marginRight: 1,
                          fontSize: "0.75rem",
                          padding: "4px 8px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click when button is clicked
                          handleEdit(
                            row.studentId,
                            row.facultyId,
                            row.semesterId,
                            row.studentName,
                            row.address,
                            row.contactNo
                          ); // Your edit logic
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={
                          <FaTrash size={15} style={{ color: "#f44336" }} />
                        }
                        sx={{
                          color: "#f44336",
                          borderColor: "#f44336",
                          "&:hover": { borderColor: "#f44336", color: "#f44336" },
                          marginRight: 1,
                          fontSize: "0.75rem",
                          padding: "4px 8px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click when button is clicked
                          handleDelete(row.studentId); // Your delete logic
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredService.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDeleteCardId={deleteCardId}
        name="students"
        fetchData={fetchData}
      />
    </Paper>
  );
};

export default StudentManagement;
