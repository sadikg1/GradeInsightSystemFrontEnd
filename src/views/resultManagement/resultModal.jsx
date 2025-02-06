import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Autocomplete } from '@mui/material';
import { getData, postData } from 'apiHandler/apiHandler';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import showToast from 'toastMessage/showToast';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const ResultModal = ({ isOpen, handleClose }) => {
  const [courses, setCourses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]); // Declare faculties state
  const [allSemesters, setAllSemesters] = useState([]);
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const initialValues = {
    studentId: '',
    courseId: '',
    examTypeId: '',
    mark: ''
  };

  const validationSchema = Yup.object({
    examTypeId: Yup.string().required('Exam Type is required'),
    facultyId: Yup.string().required('Faculty is required'),
    semesterId: Yup.string().required('Semester is required'),
    courseId: Yup.string().required('Course is required'),
    studentId: Yup.string().required('Student is required'),
    mark: Yup.number().required('Marks are required').min(0, 'Marks cannot be negative').max(100, 'Marks cannot exceed 100')
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await postData('/marks', values);
      resetForm();
      showToast("success","Marks added sucessfully")
      handleClose();
      window.location.reload(); 
    } catch (err) {
      console.log(err);
      showToast("error","Error adding marks")
    }
  };

  const fetchData = async () => {
    try {
      const examTypeResponse = await getData('/examTypes');
      setExamTypes(examTypeResponse.data);

      const courseResponse = await getData('/courses');
      setCourses(courseResponse.data);

      const studentResponse = await getData('/students');
      setStudents(studentResponse.data);

      const facultyResponse = await getData('/faculties');
      setFaculties(facultyResponse.data); // Make sure faculties is populated

      const semesterResponse = await getData('/semesters');
      setAllSemesters(semesterResponse.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFacultyChange = (facultyId, setFieldValue) => {
    setFieldValue('facultyId', facultyId);
    setFieldValue('semesterId', '');
    setFieldValue('courseId', '');
    setFieldValue('studentId', '');

    const filtered = allSemesters.filter((sem) => sem.facultyId === facultyId);
    setFilteredSemesters(filtered);
    setFilteredCourses([]);
    setFilteredStudents([]);
  };

  const handleSemesterChange = (semesterId, setFieldValue) => {
    setFieldValue('semesterId', semesterId);
    setFieldValue('courseId', ''); // Reset course field
    setFieldValue('studentId', ''); // Reset student field

    // Filter courses based on selected semesterId
    const filteredCourses = courses.filter((course) => course.semesterId === semesterId);
    setFilteredCourses(filteredCourses);

    // Optionally, you can also filter students based on the semester, if needed
    const filteredStudents = students.filter((student) => student.semesterId === semesterId);
    setFilteredStudents(filteredStudents);
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add Result
        </Typography>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ setFieldValue, values, touched, errors }) => (
            <Form>
              {/* Exam Type Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Exam Type</InputLabel>
                <Field as={Select} name="examTypeId" onChange={(e) => setFieldValue('examTypeId', e.target.value)}>
                  {examTypes.map((exam) => (
                    <MenuItem key={exam.examTypeId} value={exam.examTypeId}>
                      {exam.examTypeName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              {touched.examTypeId && errors.examTypeId && <div>{errors.examTypeId}</div>}

              {/* Faculty Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Faculty</InputLabel>
                <Field as={Select} name="facultyId" onChange={(e) => handleFacultyChange(e.target.value, setFieldValue)}>
                  {faculties.map((faculty) => (
                    <MenuItem key={faculty.facultyId} value={faculty.facultyId}>
                      {faculty.facultyName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              {touched.facultyId && errors.facultyId && <div>{errors.facultyId}</div>}

              {/* Semester Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Semester</InputLabel>
                <Field
                  as={Select}
                  name="semesterId"
                  disabled={!values.facultyId}
                  onChange={(e) => handleSemesterChange(e.target.value, setFieldValue)}
                >
                  {filteredSemesters.map((semester) => (
                    <MenuItem key={semester.semesterId} value={semester.semesterId}>
                      {semester.semesterName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              {touched.semesterId && errors.semesterId && <div>{errors.semesterId}</div>}

              {/* Course Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Course</InputLabel>
                <Field as={Select} name="courseId" disabled={!values.semesterId}>
                  {filteredCourses.map((course) => (
                    <MenuItem key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              {touched.courseId && errors.courseId && <div>{errors.courseId}</div>}

              {/* Student Name AutoComplete */}
              <Field name="studentId">
                {({ field, form }) => (
                  <Autocomplete
                    {...field}
                    options={filteredStudents}
                    getOptionLabel={(option) => option.studentName}
                    isOptionEqualToValue={(option, value) => option.studentId === value.studentId}
                    value={filteredStudents.find((student) => student.studentId === form.values.studentId) || null}
                    onChange={(event, newValue) => {
                      form.setFieldValue(field.name, newValue ? newValue.studentId : '');
                    }}
                    renderInput={(params) => <TextField {...params} label="Student Name" fullWidth margin="normal" />}
                  />
                )}
              </Field>
              {touched.studentId && errors.studentId && <div>{errors.studentId}</div>}

              {/* Marks Input */}
              <Field as={TextField} type="number" name="mark" label="Marks" fullWidth margin="normal" />
              {touched.mark && errors.mark && <div>{errors.mark}</div>}
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="contained" color="primary" type="submit" >
                  Add
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ResultModal;
