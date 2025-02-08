import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Avatar from '@mui/material/Avatar'; // Added Avatar for consistent icon presentation
import { getData } from 'apiHandler/apiHandler';

// Faculty-wise student count


// Faculty Card Component
const FacultyCard = ({ faculty, totalStudents }) => {
  return (
    <Card
      variant="outlined"
      style={{ boxShadow: 'none',border: '2px solid #ccc', borderRadius: '10px' }}
      sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}
    >
      <Avatar
        sx={{
          width: 50,
          height: 50,
          marginRight: 2,
          bgcolor: 'rgba(255, 0, 0, 0.1)', // Subtle background
          color: 'rgba(255, 0, 0, 0.8)' // Consistent icon color
        }}
      >
        <AccountBalanceIcon fontSize="medium" />
      </Avatar>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" color={'rgb(255, 0, 0)'}>
          {faculty}
        </Typography>
        <Typography variant="body1" color="black">
          <strong>Total Students:</strong> {totalStudents}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Main Component
const FacultyTotal = () => {
  const [studentInFacultyCount, setStudentFacultyCount] = useState([]);
  const fetchData = async () => {
    const totalStudentInFaculty = await getData('students/studentCount');
    setStudentFacultyCount(totalStudentInFaculty.data);
  };
  console.log("studentFaculty",studentInFacultyCount)
  useEffect(() => {
      fetchData();
    }, []);
    const faculties = Object.entries(studentInFacultyCount || {}).map(([facultyName, studentCount], index) => ({
      id: index + 1, 
      faculty: facultyName, 
      totalStudents: studentCount
    }));
    console.log("count",faculties)
  return (
    <div>
      <Grid container spacing={2}>
        {faculties.map((faculty) => (
          <Grid item lg={4} xs={12} md={12} key={faculty.id}>
            <FacultyCard faculty={faculty.faculty} totalStudents={faculty.totalStudents} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FacultyTotal;
