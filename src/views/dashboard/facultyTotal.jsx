import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Avatar from '@mui/material/Avatar'; // Added Avatar for consistent icon presentation

// Faculty-wise student count
const faculties = [
  {
    id: 1,
    faculty: 'BSc. CSIT',
    totalStudents: 120
  },
  {
    id: 2,
    faculty: 'BCA',
    totalStudents: 95
  },
  {
    id: 3,
    faculty: 'BBM',
    totalStudents: 80
  }
];

// Faculty Card Component
const FacultyCard = ({ faculty, totalStudents }) => {
  return (
    <Card
      variant="outlined"
      style={{ boxShadow: 'none', borderRadius: '10px' }}
      sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%',backgroundColor:'rgb(246, 243, 243)' }}
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
  return (
    <div>
      <Card sx={{ borderRadius: '10px' }}>
        <CardContent>
          <Grid container spacing={2}>
            {faculties.map((faculty) => (
              <Grid item lg={4} xs={12} md={12} key={faculty.id}>
                <FacultyCard faculty={faculty.faculty} totalStudents={faculty.totalStudents} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyTotal;
