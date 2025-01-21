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
  TablePagination
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

const Faculty = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({ facultyName: '' });

  // function for closing modal
  const handleClose = () => {
    setOpen(false);
    setInitialValues({ facultyName: '' });
  };

  // function for opening modal
  const handleClickOpen = () => {
    setIsEdit(false);
    setInitialValues({ facultyName: '' });
    setOpen(true);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // function for getting the data
  const fetchData = async () => {
    setLoading(true);
    return await getData('/faculties')
      .then((res) => {
        setFaculty(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  const alphabeticalComparator = (a, b) => {
    if (a.facultyName < b.facultyName) return -1;
    if (a.facultyName > b.facultyName) return 1;
    return 0;
  };
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('facultyName');
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const sortedStatus = [...faculty].sort((a, b) => {
    if (orderBy === 'facultyName') {
      return order === 'asc' ? alphabeticalComparator(a, b) : alphabeticalComparator(b, a);
    }
    return 0;
  });
  const validationSchema = Yup.object().shape({
    facultyName: Yup.string().max(100).required('faculty Name is required')
  });
  const filteredStatus = sortedStatus.filter((faculty) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return faculty.facultyName.toLowerCase().includes(lowerCaseSearchTerm);
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      document.getElementById('searchInput').focus(); // Focus the input when expanding
    }
  };
  // Submitting the form
  const handleSubmit = async (values) => {
    try {
      if (isEdit && editCardId) {
        await putData(`/faculties/${editCardId}`, { ...values, facultyId: editCardId });
        
      } else {
        await postData('/faculties', values);

      }
      fetchData();
      handleClose();
    } catch (err) {
     console.log(err)
    }
  };

  // Edit Status Card
  const handleEdit = (id, name) => {
    setIsEdit(true);
    setEditCardId(id);
    setOpen(true);
    setInitialValues({ facultyName: `${name}` });
  };

  // Delete Status Card
  const handleDelete = (id) => {
    setDeleteCardId(id);
    setDeleteModalVisible(true);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', height: '100%', paddingLeft: '15px', paddingRight: '15px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '13px',
          marginRight: '15px'
        }}
      >
        <div>
          <Typography style={{ marginLeft: '20px', marginTop: '10px' }} fontWeight="bold" variant="h3">
            Faculty Records
          </Typography>
          <div style={{ marginLeft: '20px', marginTop: '7px' }}>Total Faculty:{faculty.length}</div>
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
          <Button
            variant="contained"
            style={{ background: 'primary', height: '40px' }}
            onClick={handleClickOpen}
          >
            Add Faculty
          </Button>
        </div>
      </div>
      {/* Add/Edit Modal */}

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
            {isEdit ? 'Edit Faculty Registration' : 'Faculty Registration'}
          </Typography>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      required
                      name="facultyName"
                      label="Faculty Name"
                      fullWidth
                      error={touched.facultyName && Boolean(errors.facultyName)}
                      helperText={touched.facultyName && errors.facultyName}
                      variant="filled"
                    />
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
                  active={orderBy === 'facultyName'}
                  direction={orderBy === 'facultyName' ? order : 'asc'}
                  onClick={() => handleRequestSort('facultyName')}
                >
                  Name
                  {orderBy === 'facultyName' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ paddingRight: '50px' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStatus.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover key={row.facultyId}>
                <TableCell style={{ paddingLeft: '10px' }}>{row.facultyName}</TableCell>
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
                      e.stopPropagation(); 
                      handleEdit(row.facultyId, row.facultyName); 
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
                      e.stopPropagation(); 
                      handleDelete(row.facultyId); 
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
        count={filteredStatus.length}
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
        name="faculties"
     
        fetchData={fetchData}
      
      />
    </Paper>
  );
};

export default Faculty;