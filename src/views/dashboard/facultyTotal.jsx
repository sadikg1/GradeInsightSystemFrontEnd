import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import SchoolIcon from "@mui/icons-material/School"; // Importing an icon
// Faculty-wise student count
const faculties = [
  {
    id: 1,
    faculty: "BSc. CSIT",
    totalStudents: 120,
  },
  {
    id: 2,
    faculty: "BCA",
    totalStudents: 95,
  },
  {
    id: 3,
    faculty: "BBM",
    totalStudents: 80,
  },
];

// Faculty Card Component
const FacultyCard = ({ faculty, totalStudents }) => {
  return (
    <Card
      variant="outlined"
      style={{ boxShadow: "none",borderRadius:"10px" }}
      sx={{ display: "flex", alignItems: "center", p: 2, height: "100%" }}
    >
      <SchoolIcon sx={{ width: 50, height: 50, marginRight: 2, color: "rgba(255, 0, 0, 0.78)" }} />
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
