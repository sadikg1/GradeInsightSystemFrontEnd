import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
  Grid,
  TablePagination
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getData } from 'apiHandler/apiHandler';
import ResultModal from './ResultModal';

const ResultData = () => {
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentStudent, setCurrentStudent] = useState({
    studentName: '',
    marks: {}
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      const response = await getData('/marks/result');
      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resultData = results.map((result) => {
    const marks = {};
    marks[result.marks.courseId] = result.marks.mark;

    return {
      StudentId: result.studentId,
      StudentName: result.studentName,
      FacultyId: result.facultyId,
      SemesterId: result.semesterId,
      marks
    };
  });

  const coursesData = results.map((course) => ({
    CourseId: course.marks.courseId,
    CourseName: course.marks.courseName
  }));

  const faculties = results.map((faculty) => ({
    FacultyId: faculty.facultyId,
    FacultyName: faculty.facultyName
  }));

  const semesters = results.map((semester) => ({
    SemesterId: semester.semesterId,
    SemesterName: semester.semesterName
  }));

  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
    setSelectedSemester('');
    setStudents([]);
  };

  const handleSemesterChange = (event) => {
    const semester = event.target.value;
    setSelectedSemester(semester);

    const filteredStudents = resultData.filter((student) => student.FacultyId === selectedFaculty && student.SemesterId === semester);
    setStudents(filteredStudents);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setCurrentStudent({ studentName: '', marks: {} });
    setIsModalOpen(true);
  };

  const handleEditClick = (student) => {
    setIsEditMode(true);
    setCurrentStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (studentId) => {
    setStudents(students.filter((student) => student.StudentId !== studentId));
  };

  const handleModalSubmit = (studentData) => {
    if (isEditMode) {
      setStudents(students.map((student) => (student.StudentId === studentData.StudentId ? studentData : student)));
    } else {
      setStudents([...students, { ...studentData, StudentId: `S${students.length + 1}` }]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const filteredStudents = students;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 4, textAlign: 'center' }}>
        Result Records
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add Result
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Select Faculty</InputLabel>
            <Select value={selectedFaculty} onChange={handleFacultyChange} label="Select Faculty">
              {faculties.map((faculty) => (
                <MenuItem key={faculty.FacultyId} value={faculty.FacultyId}>
                  {faculty.FacultyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedFaculty && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Semester</InputLabel>
              <Select value={selectedSemester} onChange={handleSemesterChange} label="Select Semester">
                {semesters.map((semester) => (
                  <MenuItem key={semester.SemesterId} value={semester.SemesterId}>
                    {semester.SemesterName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      {students.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: '59vh', minHeight: '410px' }}
          style={{ paddingRight: '20px', paddingLeft: '20px', marginTop: '20px' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Student Name</TableCell>
                {coursesData.map((course) => (
                  <TableCell key={course.CourseId} align="center">
                    {course.CourseName}
                  </TableCell>
                ))}
                <TableCell align="right" style={{ paddingRight: '50px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.StudentId}>
                  <TableCell align="center">{student.StudentName}</TableCell>
                  {coursesData.map((course) => (
                    <TableCell key={course.CourseId} align="center">
                      {student.marks[course.CourseId] || '-'}
                    </TableCell>
                  ))}
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
                      onClick={() => handleEditClick(student)}
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
                      onClick={() => handleDelete(student.StudentId)}
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
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {selectedSemester && students.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 4, color: 'red' }}>
          No results available for this semester.
        </Typography>
      )}

      <ResultModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleSubmit={handleModalSubmit}
        isEditMode={isEditMode}
        result={results}
         />
    </Box>
  );
};

export default ResultData;
