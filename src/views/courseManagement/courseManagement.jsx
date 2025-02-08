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
  MenuItem
} from '@mui/material';
import { Box } from '@mui/system';
import { Field, Form, Formik } from 'formik';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';
import { FaBriefcaseMedical, FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { visuallyHidden } from '@mui/utils';
import DeleteModal from 'modal/DeleteModal';
import { getData, postData, putData } from 'apiHandler/apiHandler';
import showToast from 'toastMessage/showToast';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: 'auto',
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: '10px'
};

const CourseManagement = () => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [course, setCourse] = useState([]);
  const [semester, setSemester] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({ courseName: '', courseId: '' });

  // function for closing modal
  const handleClose = () => {
    setOpen(false);
    setInitialValues({ courseName: '', semesterId: '' });
  };

  // function for opening modal
  const handleClickOpen = () => {
    setIsEdit(false);
    setOpen(true);
    setInitialValues({ courseName: '', semesterId: '' });
  };

  // function for getting the data
  const fetchData = async () => {
    setLoading(true);
    try {
      await getData('/courses').then((res) => setCourse(res.data));
      await getData('/semesters').then((res) => setSemester(res.data));
    } catch (err) {
      console.log('Error is:', err);
    }
    setLoading(false);
  };
  const alphabeticalComparator = (a, b) => {
    if (a.courseName < b.courseName) return -1;
    if (a.courseName > b.courseName) return 1;
    return 0;
  };
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('courseName');
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const sortedService = [...course].sort((a, b) => {
    if (orderBy === 'courseName') {
      return order === 'asc' ? alphabeticalComparator(a, b) : alphabeticalComparator(b, a);
    }
    return 0;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    courseName: Yup.string().max(100).required('Course Name is required'),
    semesterId: Yup.string().max(100).required('Semester Name is required')
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
        await putData(`/courses/${editCardId}`, { ...values, courseId: editCardId });
        showToast('success', 'Successfully Updated Course');
      } else {
        await postData('/courses', values);
        showToast('success', 'Successfully Added Course');
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.log(err);
      showToast('error', 'Error Adding Course');
    }
  };

  const handleEdit = (id, semesterId, name) => {
    setIsEdit(true);
    setEditCardId(id);
    setOpen(true);
    setInitialValues({ courseName: name, semesterId: semesterId });
  };

  // Delete Service Card
  const handleDelete = (id) => {
    setDeleteCardId(id);
    setDeleteModalVisible(true);
  };
  const filteredService = sortedService.filter((course) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return course.courseName.toLowerCase().includes(lowerCaseSearchTerm);
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      document.getElementById('searchInput').focus(); // Focus the input when expanding
    }
  };
  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        height: '100%',
        paddingLeft: '15px',
        paddingRight: '15px',
        border: '2px solid #ccc',
        borderRadius: '10px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '13px',
          marginRight: '10px'
        }}
      >
        <div>
          <Typography style={{ marginLeft: '20px', marginTop: '10px' }} fontWeight="bold" variant="h3">
            Course Records
          </Typography>
          <div style={{ marginLeft: '20px', marginTop: '7px' }}>Total Course:{course.length}</div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ position: 'relative', marginRight: '40px', height: '0px' }}>
            <input
              id="searchInput"
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                height: '35px',
                width: isExpanded ? '215px' : '0px', // Control width based on state
                borderRadius: '10px',
                border: '1px solid gray',
                paddingLeft: '15px', // Padding for the text
                transition: 'width 0.3s ease, opacity 0.3s ease', // Smooth transition
                opacity: isExpanded ? '1' : '0', // Fade effect
                paddingRight: '40px' // Add right padding to avoid text overlap with the icon
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #1d396e',
                background: '#1d396e', // Red border around the icon
                padding: '5px', // Adds space around the icon
                position: 'absolute', // Make the position absolute
                right: '0px', // Position it inside the input
                top: '17px', // Center vertically
                transform: 'translateY(-50%)', // Adjust for perfect centering
                width: '36px',
                height: '35px',
                borderRadius: '10px', // Rounded corners
                zIndex: 1 // Ensure it stays above the input
              }}
            >
              <FaSearch
                onClick={toggleExpand}
                style={{
                  cursor: 'pointer',
                  color: 'white',
                  width: '15px',
                  height: '15px'
                }}
              />
            </div>
          </div>
          <Button variant="contained" style={{ background: 'primary', height: '40px' }} onClick={handleClickOpen}>
            Add Course
          </Button>
        </div>
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h2" component="h2" style={{ marginBottom: '50px' }}>
            {isEdit ? 'Edit Course Registration' : 'Course Registration'}
          </Typography>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
            {({ errors, touched, values, handleChange, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="courseName"
                      label="Course Name"
                      fullWidth
                      error={touched.courseName && Boolean(errors.courseName)}
                      helperText={touched.courseName && errors.courseName}
                      variant="filled"
                    />
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
                      style={{ height: '50px', marginTop: '8px', borderRadius: '10px' }}
                    >
                      <MenuItem disabled>Select Semester</MenuItem>
                      {semester.map((item, i) => {
                        return (
                          <MenuItem value={item.semesterId} key={i}>
                            {item.semesterName}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: 'right' }}>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      onClick={() => {
                        handleClose();
                      }}
                      style={{ marginRight: '8px', background: '#808080' }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" style={{ background: 'primary' }} disabled={isSubmitting}>
                      {isEdit ? 'Update' : 'Submit'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <TableContainer sx={{ maxHeight: '59vh', minHeight: '410px' }} style={{ paddingRight: '20px', paddingLeft: '20px' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ paddingLeft: '10px' }}>
                <TableSortLabel
                  active={orderBy === 'courseName'}
                  direction={orderBy === 'courseName' ? order : 'asc'}
                  onClick={() => handleRequestSort('courseName')}
                >
                  Name
                  {orderBy === 'courseName' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Semester</TableCell>
              <TableCell align="center">Creation Date</TableCell>
              <TableCell align="right" style={{ paddingRight: '50px' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredService.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover key={row.courseId}>
                <TableCell style={{ paddingLeft: '10px' }}>{row.courseName}</TableCell>

                <TableCell align="center">{row.semester.semesterName}</TableCell>
                <TableCell align="center">{row.dateCreated.split('T')[0]}</TableCell>
                <TableCell align="right" style={{ paddingRight: '5px' }}>
                  <Button
                    variant="outlined"
                    startIcon={<FaEdit size={15} style={{ color: '#2397F3' }} />}
                    sx={{
                      color: '#2397F3',
                      borderColor: '#2397F3',
                      '&:hover': { borderColor: '#2397F3', color: '#2397F3' },
                      marginRight: 1,
                      fontSize: '0.75rem',
                      padding: '4px 8px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click when button is clicked
                      handleEdit(row.courseId, row.semesterId, row.courseName); // Your edit logic
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FaTrash size={15} style={{ color: '#f44336' }} />}
                    sx={{
                      color: '#f44336',
                      borderColor: '#f44336',
                      '&:hover': { borderColor: '#f44336', color: '#f44336' },
                      marginRight: 1,
                      fontSize: '0.75rem',
                      padding: '4px 8px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click when button is clicked
                      handleDelete(row.courseId); // Your delete logic
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
        name="courses"
        fetchData={fetchData}
      />
    </Paper>
  );
};

export default CourseManagement;
