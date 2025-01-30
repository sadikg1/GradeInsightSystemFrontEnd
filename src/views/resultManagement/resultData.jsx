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
import DeleteModal from 'modal/DeleteModal';

const ResultData = () => {
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [deleteCardId, setDeleteCardId] = useState('');
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [apiSemester, setApiSemester] = useState([]);
  const [apiFaculty, setApiFaculty] = useState([]);
  const [apiExam, setApiExam] = useState([]);
  const [apiCourse, setApiCourse] = useState([]);

  const [editStudent, setEditStudent] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  console.log('student', editStudent);

  const fetchData = async () => {
    try {
      const response = await getData('/marks/result');
      setResults(response.data);

      const examType = await getData('/examTypes');
      setApiExam(examType.data);

      const facultyResponse = await getData('/faculties');
      setApiFaculty(facultyResponse.data);

      const semesterResponse = await getData('/semesters');
      setApiSemester(semesterResponse.data);
      const courseResponse = await getData('/courses');
      setApiCourse(courseResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resultData = results.map((result) => {
    const marks = {};

    result.marks.forEach((mark) => {
      if (!marks[mark.courseId]) {
        marks[mark.courseId] = {};
      }
      marks[mark.courseId][mark.examTypeId] = mark.mark;
    });

    return {
      StudentId: result.studentId,
      StudentName: result.studentName,
      FacultyId: result.facultyId,
      FacultyName: result.facultyName,

      SemesterId: result.semesterId,
      SemesterName: result.semesterName,
      ExamTypeId: [...new Set(result.marks.map((e) => e.examTypeId))], // Unique exam type IDs
      marks
    };
  });
  console.log('resulData', resultData);

  const filteredCourses = apiCourse.filter((course) => course.semesterId === selectedSemester);

  const faculties = apiFaculty.map((faculty) => ({
    FacultyId: faculty.facultyId,
    FacultyName: faculty.facultyName
  }));

  const semesters = apiSemester.map((semester) => ({
    SemesterId: semester.semesterId,
    SemesterName: semester.semesterName
  }));

  const examType = apiExam.map((exam) => ({
    ExamTypeId: exam.examTypeId,
    ExamTypeName: exam.examTypeName
  }));

  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
    setSelectedSemester('');
    setSelectedExamType('');
    setStudents([]);
  };

  const handleSemesterChange = (event) => {
    const semester = event.target.value;
    setSelectedSemester(semester);
    setSelectedExamType('');
    setStudents([]);
  };
  const handleExamTypeChange = (event) => {
    const examTypes = event.target.value;
    setSelectedExamType(examTypes);

    const filteredStudents = resultData
      .filter((student) => {
        const isFacultyAndSemesterMatch = student.FacultyId === selectedFaculty && student.SemesterId === selectedSemester;

        // Check if the student has the selected ExamTypeId in their ExamTypeId array
        const hasSelectedExamType = student.ExamTypeId.some((id) => id === examTypes);

        // If both conditions are true, return the student
        return isFacultyAndSemesterMatch && hasSelectedExamType;
      })
      .map((student) => {
        // For each student, we will return only marks for the selected ExamTypeId
        const filteredMarks = {};
        student.ExamTypeId.forEach((examTypeId) => {
          if (examTypeId === examTypes) {
            // If the examTypeId matches, include the marks for that examTypeId
            Object.keys(student.marks).forEach((courseId) => {
              if (student.marks[courseId][examTypeId] !== undefined) {
                filteredMarks[courseId] = student.marks[courseId][examTypeId];
              }
            });
          }
        });

        return {
          ...student,
          marks: filteredMarks
        };
      });

    setStudents(filteredStudents);
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
    setEditStudent('');
  };

  const handleEditClick = (student) => {
    setEditStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (markId) => {
    setIsDeleteModalOpen(true);
    setDeleteCardId(markId);
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
  console.log('PreBoard Exam', filteredStudents);

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
        {selectedSemester && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Exam Type</InputLabel>
              <Select value={selectedExamType} onChange={(event) => handleExamTypeChange(event)} label="Select ExamType">
                {examType.map((exam) => (
                  <MenuItem key={exam.ExamTypeId} value={exam.ExamTypeId}>
                    {exam.ExamTypeName}
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
                {filteredCourses.map((course) => (
                  <TableCell key={course.courseId} align="center">
                    {course.courseName}
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
                  {filteredCourses.map((course) => (
                    <TableCell key={course.courseId} align="center">
                      {student.marks[course.courseId] !== undefined ? student.marks[course.courseId] : '-'}
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
                      onClick={() => handleDelete(student.MarksId)}
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

      {selectedExamType && students.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 4, color: 'red' }}>
          No results available for this semester and ExamType.
        </Typography>
      )}

      <ResultModal isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} handleSubmit={handleModalSubmit} student={editStudent} />
      <DeleteModal
        deleteModalVisible={deleteModalOpen}
        setDeleteModalVisible={setIsDeleteModalOpen}
        handleDeleteCardId={deleteCardId}
        name="marks"
        fetchData={() => window.location.reload()}
      />
    </Box>
  );
};

export default ResultData;
