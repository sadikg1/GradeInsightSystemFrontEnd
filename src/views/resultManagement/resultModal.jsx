import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Autocomplete } from '@mui/material';
import { getData, postData, putData } from 'apiHandler/apiHandler';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup'; // For form validation

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

const ResultModal = ({ isOpen, handleClose, isEditMode, result }) => {
  const [course, setCourses] = useState([]);
  const [examTypes, setExamType] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const initialValues = {
    courseId: '',
    studentId: '',
    examTypeId: '',
    mark: ''
  };
  const validationSchema = Yup.object({
    // examtypeId: Yup.string().required('Exam Type  is required'),
    // courseId: Yup.string().required('Course is required'),
    // studentId: Yup.string().required('Student name is required'),
    // mark: Yup.number().required('Marks are required').positive().integer()
  });
  const handleSubmit = async (values) => {
    try {
      await postData('/marks', values);

      fetchData();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  const fetchData = async () => {
    const examType = await getData('/examTypes');
    setExamType(examType.data);

    const courseResponse = await getData('/courses');
    setCourses(courseResponse.data);

    const studentResponse = await getData('/students');
    setSelectedStudents(studentResponse.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditMode ? 'Edit Result' : 'Add Result'}
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values); // Pass Formik values to parent on submit
            handleClose();
          }}
        >
          {({ setFieldValue, values, touched, errors }) => (
            <Form>
              {/* Faculty Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Exam Type</InputLabel>
                <Field
                  as={Select}
                  name="examTypeId"
                  value={values.examTypeId}
                  onChange={(e) => setFieldValue('examTypeId', e.target.value)}
                  label="Select Exam Type"
                >
                  {examTypes.map((exam) => (
                    <MenuItem key={exam.examTypeId} value={exam.examTypeId}>
                      {exam.examTypeName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              {touched.examTypeId && errors.examTypeId && <div>{errors.examTypeId}</div>}

              <FormControl fullWidth margin="normal">
                <InputLabel>Select Course</InputLabel>
                <Field
                  as={Select}
                  name="courseId"
                  value={values.courseId}
                  onChange={(e) => setFieldValue('courseId', e.target.value)}
                  label="Select Course"
                >
                  {course.map((course) => (
                    <MenuItem key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              {touched.courseId && errors.courseId && <div>{errors.courseId}</div>}

              {/* Course Dropdown */}

              <Field
                as={TextField}
                type="number" // Restricts input to numeric values
                name="mark"
                label="Marks"
                value={values.mark}
                onChange={(e) => setFieldValue('mark', e.target.value)}
                fullWidth
                margin="normal"
                error={touched.mark && Boolean(errors.mark)}
                helperText={touched.mark && errors.mark}
              />

              {/* Student Name AutoComplete */}
              <Field name="studentId">
                {({ field, form }) => (
                  <Autocomplete
                    {...field}
                    options={selectedStudents}
                    getOptionLabel={(option) => option.studentName}
                    isOptionEqualToValue={(option, value) => option.studentId === value.studentId}
                    value={selectedStudents.find((student) => student.studentId === form.values.studentId) || null}
                    onChange={(event, newValue) => {
                      form.setFieldValue(field.name, newValue ? newValue.studentId : '');
                    }}
                    renderInput={(params) => <TextField {...params} label="Student Name" fullWidth margin="normal" />}
                  />
                )}
              </Field>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="contained" color="primary" type="submit">
                  {isEditMode ? 'Update' : 'Add'}
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
