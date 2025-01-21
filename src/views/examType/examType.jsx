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

const ExamType = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [examType, setExamType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({ examTypeName: '' });

  // function for closing modal
  const handleClose = () => {
    setOpen(false);
    setInitialValues({ examTypeName: '' });
  };

  // function for opening modal
  const handleClickOpen = () => {
    setIsEdit(false);
    setInitialValues({ examTypeName: '' });
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
    return await getData('/examTypes')
      .then((res) => {
        setExamType(res.data);
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
    if (a.examTypeName < b.examTypeName) return -1;
    if (a.examTypeName > b.examTypeName) return 1;
    return 0;
  };
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('examTypeName');
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const sortedStatus = [...examType].sort((a, b) => {
    if (orderBy === 'examTypeName') {
      return order === 'asc' ? alphabeticalComparator(a, b) : alphabeticalComparator(b, a);
    }
    return 0;
  });
  const validationSchema = Yup.object().shape({
    examTypeName: Yup.string().max(100).required('Exam Type Name is required')
  });
  const filteredStatus = sortedStatus.filter((examType) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return examType.examTypeName.toLowerCase().includes(lowerCaseSearchTerm);
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
        await putData(`/examTypes/${editCardId}`, { ...values, examTypeId: editCardId });
      } else {
        await postData('/examTypes', values);
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  // Edit Status Card
  const handleEdit = (id, name) => {
    setIsEdit(true);
    setEditCardId(id);
    setOpen(true);
    setInitialValues({ examTypeName: `${name}` });
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
            Exam Type Records
          </Typography>
          <div style={{ marginLeft: '20px', marginTop: '7px' }}>Total Exam Type:{examType.length}</div>
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
            Add Exam Type
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
            {isEdit ? 'Edit ExamType Registration' : 'ExamType Registration'}
          </Typography>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      required
                      name="examTypeName"
                      label="ExamType Name"
                      fullWidth
                      error={touched.examTypeName && Boolean(errors.examTypeName)}
                      helperText={touched.examTypeName && errors.examTypeName}
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
                  active={orderBy === 'examTypeName'}
                  direction={orderBy === 'examTypeName' ? order : 'asc'}
                  onClick={() => handleRequestSort('examTypeName')}
                >
                  Name
                  {orderBy === 'examTypeName' ? (
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
              <TableRow hover key={row.examTypeId}>
                <TableCell style={{ paddingLeft: '10px' }}>{row.examTypeName}</TableCell>
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
                      handleEdit(row.examTypeId, row.examTypeName);
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
                      handleDelete(row.examTypeId);
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
        name="examTypes"
        fetchData={fetchData}
      />
    </Paper>
  );
};

export default ExamType;
