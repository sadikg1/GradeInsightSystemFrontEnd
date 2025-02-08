import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getData } from 'apiHandler/apiHandler';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Paper } from '@mui/material';

// Registering necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const ResultView = () => {
  const location = useLocation();
  const { studentId } = location.state || {}; // Handle possible undefined state

  const [studentData, setStudentData] = useState(null);

  const [courseData, setCourseData] = useState([]);
  const [preBoardStatus, setPreBoardStatus] = useState(''); // State for Pre-board status
  const [internalStatus, setInternalStatus] = useState(''); // State for Internal status
  const [preBoardAverage, setPreBoardAverage] = useState(0); // Average for Pre-board
  const [internalAverage, setInternalAverage] = useState(0); // Average for Internal Exam

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return; // Ensure studentId is available before making the request
      try {
        const response = await getData(`marks/student/${studentId}`);
        console.log('API Response:', response);
        const studentDataResponse = await getData(`students/${studentId}`);

        const studentData = response.data.find((student) => student.studentId === studentId);

        if (studentData) {
          setStudentData(studentData);
          setCourseData(studentData.marks);

          const passingMark = 40;

          // Pre-board Exam status and average calculation
          const preBoardMarks = studentData.marks.filter((mark) => mark.examTypeName === 'Pre-board Exam');

          if (preBoardMarks.length === 0) {
            setPreBoardStatus('Not Available');
            setPreBoardAverage(0);
          } else {
            const totalPreBoardMarks = preBoardMarks.reduce((acc, mark) => acc + mark.mark, 0);
            const preBoardAveragePercentage = (totalPreBoardMarks / (preBoardMarks.length * 100)) * 100;
            const allPassedPreBoard = preBoardMarks.every((mark) => mark.mark >= passingMark);
            setPreBoardStatus(allPassedPreBoard ? 'Pass' : 'Fail');
            setPreBoardAverage(preBoardAveragePercentage);
          }

          const internalMarks = studentData.marks.filter((mark) => mark.examTypeName === 'Internal Exam');

          if (internalMarks.length === 0) {
            setInternalStatus('Not Available');
            setInternalAverage(0);
          } else {
            const totalInternalMarks = internalMarks.reduce((acc, mark) => acc + mark.mark, 0);
            const internalAveragePercentage = (totalInternalMarks / (internalMarks.length * 100)) * 100;
            const allPassedInternal = internalMarks.every((mark) => mark.mark >= passingMark);
            setInternalStatus(allPassedInternal ? 'Pass' : 'Fail');
            setInternalAverage(internalAveragePercentage);
          }
        } else {
          console.error('Student not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [studentId]);

  if (!studentId) {
    return <h2>No student data available</h2>;
  }

  if (!studentData) {
    return <h2>Loading...</h2>; // Show loading if student data is not fetched yet
  }

  // Extract initial and other profile data
  const studentInitials = studentData.studentName
    ? studentData.studentName
        .split(' ')
        .map((name) => name[0])
        .join('')
    : '';

  // Prepare data for Bar and Line charts
  const subjects = [...new Set(courseData.map((mark) => mark.courseName))];
  const preBoardMarks = subjects.map((subject) => {
    const mark = courseData.find((m) => m.courseName === subject && m.examTypeName === 'Pre-board Exam');
    return mark ? mark.mark : 0;
  });
  const internalMarks = subjects.map((subject) => {
    const mark = courseData.find((m) => m.courseName === subject && m.examTypeName === 'Internal Exam');
    return mark ? mark.mark : 0;
  });

  // Bar Chart Data
  const barChartData = {
    labels: subjects,
    datasets: [
      {
        label: 'Pre-board Exam Marks',
        data: preBoardMarks,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Internal Exam Marks',
        data: internalMarks,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  // Line Chart Data
  const lineChartData = {
    labels: subjects,
    datasets: [
      {
        label: 'Pre-board Exam Marks',
        data: preBoardMarks,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Internal Exam Marks',
        data: internalMarks,
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
        tension: 0.1
      }
    ]
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
      <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        {/* Profile Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2>Student Marksheet</h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Circle with initials */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                fontSize: '40px',
                fontWeight: 'bold',
                marginRight: '20px'
              }}
            >
              {studentInitials}
            </div>

            {/* Student information */}
            <div style={{ textAlign: 'left' }}>
              <h3>Student Name: {studentData.studentName}</h3>
              <p>Faculty: {studentData.facultyName}</p>
              <p>Semester: {studentData.semesterName}</p>
            </div>
          </div>
        </div>

        {/* Marks Table for Pre-board Exam */}
        <h2 style={{ textAlign: 'center' }}>Pre-board Exam</h2>
        <table border="1" cellPadding="10" style={{ width: '100%', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Pass Marks</th>
              <th>Full Marks</th>
              <th>Obtained Marks</th>
            </tr>
          </thead>
          <tbody>
            {courseData
              .filter((mark) => mark.examTypeName === 'Pre-board Exam')
              .map((mark, index) => (
                <tr key={index}>
                  <td>{mark.courseName}</td>
                  <td style={{ textAlign: 'center' }}>40</td>
                  <td style={{ textAlign: 'center' }}>100</td>
                  <td style={{ textAlign: 'center' }}>{mark.mark}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* Status and Average for Pre-board Exam */}
        <h2 style={{ color: preBoardStatus === 'Pass' ? 'green' : preBoardStatus === 'Fail' ? 'red' : 'gray' }}>
          Status: {preBoardStatus}
        </h2>
        <h3>Average: {preBoardAverage.toFixed(2)}%</h3>

        {/* Marks Table for Internal Exam */}
        <h2 style={{ textAlign: 'center' }}>Internal Exam</h2>
        <table border="1" cellPadding="10" style={{ width: '100%', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Pass Marks</th>
              <th>Full Marks</th>
              <th>Obtained Marks</th>
            </tr>
          </thead>
          <tbody>
            {courseData
              .filter((mark) => mark.examTypeName === 'Internal Exam')
              .map((mark, index) => (
                <tr key={index}>
                  <td>{mark.courseName}</td>
                  <td style={{ textAlign: 'center' }}>40</td>
                  <td style={{ textAlign: 'center' }}>100</td>
                  <td style={{ textAlign: 'center' }}>{mark.mark}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* Status and Average for Internal Exam */}
        <h2 style={{ color: internalStatus === 'Pass' ? 'green' : internalStatus === 'Fail' ? 'red' : 'gray' }}>
          Status: {internalStatus}
        </h2>

        <h3>Average: {internalAverage.toFixed(2)}%</h3>

        <h2 style={{ textAlign: 'center' }}>Marks Analysis</h2>
        {/* Bar Chart */}
        <h4>Marks Comparison - Bar Chart</h4>
        <p style={{fontFamily:"-moz-initial"}}>Performance Analysis: Pre-board vs. Internal Exams</p>
        <Bar data={barChartData} options={{ responsive: true }} />

        {/* Line Chart */}
        <h4>Marks Comparison - Line Chart</h4>
        <p style={{fontFamily:"-moz-initial"}}>Trend Analysis: Exam Performance Over Subjects</p>
        <Line data={lineChartData} options={{ responsive: true }} />
      </div>
    </Paper>
  );
};

export default ResultView;
