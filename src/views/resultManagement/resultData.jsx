import React, { useEffect, useState } from "react";
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
  TextField,
  Grid,
  TablePagination,
} from "@mui/material";
import { getData } from "apiHandler/apiHandler";
import ResultModal from "./ResultModal";
import { FaEye, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ResultData = () => {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const userType = user?.userTypeId; // 1 = Student, 2 = Admin, 3 = Teacher
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiSemester, setApiSemester] = useState([]);
  const [apiFaculty, setApiFaculty] = useState([]);
  const [apiExam, setApiExam] = useState([]);
  const [apiCourse, setApiCourse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [editStudent, setEditStudent] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      const response = await getData("/marks/result");
      setResults(response.data);

      const examType = await getData("/examTypes");
      setApiExam(examType.data);

      const facultyResponse = await getData("/faculties");
      setApiFaculty(facultyResponse.data);

      const semesterResponse = await getData("/semesters");
      setApiSemester(semesterResponse.data);
      const courseResponse = await getData("/courses");
      setApiCourse(courseResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) {
      document.getElementById("searchInput").focus(); // Focus the input when expanding
    }
  };

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
      ExamTypeId: [...new Set(result.marks.map((e) => e.examTypeId))],
      marks,
    };
  });

  const filteredCourses = apiCourse.filter(
    (course) => course.semesterId === selectedSemester
  );

  const faculties = apiFaculty.map((faculty) => ({
    FacultyId: faculty.facultyId,
    FacultyName: faculty.facultyName,
  }));

  const semesters = apiSemester.map((semester) => ({
    SemesterId: semester.semesterId,
    SemesterName: semester.semesterName,
  }));

  const examType = apiExam.map((exam) => ({
    ExamTypeId: exam.examTypeId,
    ExamTypeName: exam.examTypeName,
  }));

  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
    setSelectedSemester("");
    setSelectedExamType("");
    setStudents([]);
  };

  const handleSemesterChange = (event) => {
    const semester = event.target.value;
    setSelectedSemester(semester);
    setSelectedExamType("");
    setStudents([]);
  };

  const handleExamTypeChange = (event) => {
    const examTypes = event.target.value;
    setSelectedExamType(examTypes);

    const filteredStudents = resultData
      .filter((student) => {
        const isFacultyAndSemesterMatch =
          student.FacultyId === selectedFaculty &&
          student.SemesterId === selectedSemester;
        const hasSelectedExamType = student.ExamTypeId.some(
          (id) => id === examTypes
        );
        return isFacultyAndSemesterMatch && hasSelectedExamType;
      })
      .map((student) => {
        const filteredMarks = {};
        student.ExamTypeId.forEach((examTypeId) => {
          if (examTypeId === examTypes) {
            Object.keys(student.marks).forEach((courseId) => {
              if (student.marks[courseId][examTypeId] !== undefined) {
                filteredMarks[courseId] = student.marks[courseId][examTypeId];
              }
            });
          }
        });

        return {
          ...student,
          marks: filteredMarks,
        };
      });

    setStudents(filteredStudents);
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
    setEditStudent("");
  };
  const navigate = useNavigate();

  const handleView = (student) => {
    console.log("Student object received in handleView:", student); // Debugging log

    // Correct the property name (case-sensitive)
    const studentId = student.StudentId;

    if (!studentId) {
      console.error("Error: StudentId is missing", student);
      return;
    }

    console.log("Navigating with studentId:", studentId);
    navigate("/resultView", { state: { studentId } });
  };

  const handleModalSubmit = (studentData) => {
    setStudents([
      ...students,
      { ...studentData, StudentId: `S${students.length + 1}` },
    ]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredStudents = students.filter((student) =>
    student.StudentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        height: "100%",
        paddingLeft: "15px",
        paddingRight: "15px",
      }}
    >
      <Box sx={{ padding: 4 }}>
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
              style={{ marginTop: "10px" }}
              fontWeight="bold"
              variant="h3"
            >
              Result Records
            </Typography>
            <div style={{ marginTop: "7px", marginBottom: "20px" }}>
              Total Result:{students.length}
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                position: "relative",
                marginRight: "40px",
                height: "0px",
              }}
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
            {(userType === 2 || userType === 3) && (
              <Button
                variant="contained"
                style={{ background: "primary", height: "40px" }}
                onClick={handleAddClick}
              >
                Add Result
              </Button>
            )}
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Faculty</InputLabel>
              <Select
                value={selectedFaculty}
                onChange={handleFacultyChange}
                label="Select Faculty"
              >
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
                <Select
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                  label="Select Semester"
                >
                  {apiSemester
                    .filter(
                      (semester) => semester.facultyId === selectedFaculty
                    ) // Correct filtering
                    .map((semester) => (
                      <MenuItem
                        key={semester.semesterId}
                        value={semester.semesterId}
                      >
                        {semester.semesterName}
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
                <Select
                  value={selectedExamType}
                  onChange={handleExamTypeChange}
                  label="Select Exam Type"
                >
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

        {students.length > 0 &&
          (() => {
            // Step 1: Calculate student averages and check if they passed all subjects
            const studentAverages = filteredStudents.map((student) => {
              const totalMarks = filteredCourses.reduce(
                (sum, course) => sum + (student.marks[course.courseId] || 0),
                0
              );
              const totalFullMarks = filteredCourses.length * 100;
              const average = (totalMarks / totalFullMarks) * 100;
              const isPass = filteredCourses.every(
                (course) => (student.marks[course.courseId] || 0) >= 40
              );

              return { ...student, average, isPass };
            });

            // Step 2: Filter only students who have passed all subjects
            const passedStudents = studentAverages.filter(
              (student) => student.isPass
            );

            // Step 3: Find the topper among passed students
            const topper = passedStudents.reduce(
              (prev, curr) => (curr.average > prev.average ? curr : prev),
              {
                average: 0,
                isPass: false,
              }
            );

            return (
              <div>
                {/* Topper Display */}
                {topper.isPass && (
                  <Box
                    sx={{
                      textAlign: "center",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      marginTop: "20px",
                      marginBottom: "10px",
                    }}
                  >
                    🏆 Topper:{" "}
                    <span style={{ color: "#2397F3" }}>
                      {topper.StudentName} ({topper.average.toFixed(2)}%)
                    </span>
                  </Box>
                )}

                {/* Table */}
                <TableContainer
                  sx={{ maxHeight: "59vh", minHeight: "410px" }}
                  style={{
                    paddingRight: "20px",
                    paddingLeft: "20px",
                    marginTop: "20px",
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Student Name</TableCell>
                        {filteredCourses.map((course) => (
                          <TableCell key={course.courseId} align="center">
                            {course.courseName}
                          </TableCell>
                        ))}
                        <TableCell align="center">Average (%)</TableCell>
                        <TableCell align="center">Result</TableCell>
                        <TableCell align="center">View Result</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentAverages.map((student) => (
                        <TableRow
                          key={student.StudentId}
                          sx={{
                            backgroundColor:
                              student.StudentId === topper.StudentId
                                ? "#e0ffe0"
                                : "inherit",
                            fontWeight:
                              student.StudentId === topper.StudentId
                                ? "bold"
                                : "normal",
                          }}
                        >
                          <TableCell align="left">
                            {student.StudentName}
                            {student.StudentId === topper.StudentId && (
                              <span style={{ color: "#FFD700" }} />
                            )}
                          </TableCell>
                          {filteredCourses.map((course) => (
                            <TableCell key={course.courseId} align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {student.marks[course.courseId] !== undefined
                                  ? student.marks[course.courseId]
                                  : "-"}
                              </Box>
                            </TableCell>
                          ))}
                          <TableCell align="center">
                            {student.average.toFixed(2)}%
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              fontWeight: "bold",
                              color: student.isPass ? "green" : "red",
                            }}
                          >
                            {student.isPass ? "Pass" : "Fail"}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              startIcon={
                                <FaEye size={15} style={{ color: "#2397F3" }} />
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(student);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            );
          })()}

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
          <Typography
            variant="body1"
            sx={{ textAlign: "center", marginTop: 4, color: "red" }}
          >
            No results available for this semester and ExamType.
          </Typography>
        )}

        <ResultModal
          isOpen={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          handleSubmit={handleModalSubmit}
          student={editStudent}
        />
      </Box>
    </Paper>
  );
};

export default ResultData;
