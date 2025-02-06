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
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { visuallyHidden } from '@mui/utils';
import DeleteModal from 'modal/DeleteModal';
import { getData, postData, putData } from 'apiHandler/apiHandler';

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

const TeacherCourseManagement = () => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [teacherxCourse, setTeacherxCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({ courseId: '', teacherId: '' });

  // function for closing modal
  const handleClose = () => {
    setOpen(false);
    setInitialValues({ courseId: '', teacherId: '' });
  };

  // function for opening modal
  const handleClickOpen = () => {
    setIsEdit(false);
    setOpen(true);
    setInitialValues({ courseId: '', teacherId: '' });
  };

  // function for getting the data
  const fetchData = async () => {
    setLoading(true);
    try {
      await getData('/TeacherxCourses').then((res) => setTeacherxCourses(res.data));
      await getData('/courses').then((res) => setCourses(res.data));
      await getData('/teachers').then((res) => setTeachers(res.data));
    } catch (err) {
      console.log('Error is:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    teacherId: Yup.string().max(100).required('Teacher Name is required'),
    courseId: Yup.string().max(100).required('Course Name is required')
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
        const updatedData = await putData(`/TeacherxCourses/${editCardId}`, { ...values, teacherxCourseId: editCardId });

        // Optimistic UI update: Update the specific record in the state
        setTeacherxCourses((prevState) => {
          return prevState.map((item) => (item.teacherxCourseId === editCardId ? { ...item, ...updatedData.data } : item));
        });
      } else {
        const newData = await postData('/TeacherxCourses', values);
      }
      handleClose();
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id, teacherId, courseId) => {
    setIsEdit(true);
    setEditCardId(id);
    setOpen(true);
    setInitialValues({ teacherId: teacherId, courseId: courseId });
  };

  // Delete Service Card
  const handleDelete = (id) => {
    setDeleteCardId(id);
    setDeleteModalVisible(true);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      document.getElementById('searchInput').focus(); // Focus the input when expanding
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', height: '100%', paddingLeft: '15px', paddingRight: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '13px', marginRight: '10px' }}>
        <div>
          <Typography style={{ marginLeft: '20px', marginTop: '10px' }} fontWeight="bold" variant="h3">
            Teacher-Course Records
          </Typography>
          <div style={{ marginLeft: '20px', marginTop: '7px' }}>Total Teacher-Course: {teacherxCourse.length}</div>
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
                width: isExpanded ? '215px' : '0px',
                borderRadius: '10px',
                border: '1px solid gray',
                paddingLeft: '15px',
                transition: 'width 0.3s ease, opacity 0.3s ease',
                opacity: isExpanded ? '1' : '0',
                paddingRight: '40px'
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #1d396e',
                background: '#1d396e',
                padding: '5px',
                position: 'absolute',
                right: '0px',
                top: '17px',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '35px',
                borderRadius: '10px',
                zIndex: 1
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
            Assign Teacher Course
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
            {isEdit ? 'Edit Teacher Assign' : 'New Teacher Assign'}
          </Typography>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
            {({ errors, touched, values, handleChange, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      id="teacherId"
                      label="Teacher Name"
                      name="teacherId"
                      variant="filled"
                      required
                      value={values.teacherId}
                      fullWidth
                      onChange={handleChange}
                      style={{ height: '50px', marginTop: '8px', borderRadius: '10px' }}
                    >
                      <MenuItem disabled>Select Teacher</MenuItem>
                      {teachers &&
                        teachers.length > 0 &&
                        teachers.map((item, i) => {
                          // Safely check for teacherName and ensure the object is not null
                          if (item && item.teacherName) {
                            return (
                              <MenuItem value={item.teacherId} key={i}>
                                {item.teacherName}
                              </MenuItem>
                            );
                          }
                          return null; // Don't render if teacherName is missing
                        })}
                    </TextField>
                    <TextField
                      select
                      id="courseId"
                      label="Course Name"
                      name="courseId"
                      variant="filled"
                      required
                      value={values.courseId}
                      fullWidth
                      onChange={handleChange}
                      style={{ height: '50px', marginTop: '25px', borderRadius: '10px' }}
                    >
                      <MenuItem disabled>Select Course</MenuItem>
                      {courses.map((item, i) => {
                        return (
                          <MenuItem value={item.courseId} key={i}>
                            {item.courseName}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px',
                        alignItems: 'center'
                      }}
                    >
                      <Button type="submit" style={{ background: '#1d396e', color: 'white' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : isEdit ? 'Edit Teacher Assign' : 'Create Teacher Assign'}
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* Teacher-Course Table */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ paddingLeft: '10px' }}>
                Teacher Name
              </TableCell>
              <TableCell align="center">Course Name</TableCell>
              <TableCell align="center">Creation Date</TableCell>
              <TableCell align="right" style={{ paddingRight: '50px' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teacherxCourse
              .filter((data) => {
                if (searchTerm === '') {
                  return data;
                } else {
                  return (
                    data.teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    data.course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                }
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((data) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={data.teacherxCourseId}>
                  <TableCell align="center">{data.teacher.teacherName}</TableCell>
                  <TableCell align="center">{data.course.courseName}</TableCell>
                  <TableCell align="center">{data.dateCreated.split('T')[0]}</TableCell>
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
                        handleEdit(data.teacherxCourseId, data.teacher.teacherId, data.course.courseId); // Your edit logic
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
                        handleDelete(data.teacherxCourseId); // Your delete logic
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
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={teacherxCourse.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <DeleteModal
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDeleteCardId={deleteCardId}
        name="teacherxCourses"
        fetchData={fetchData}
      />
    </Paper>
  );
};

export default TeacherCourseManagement;
