import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuBookIcon from "@mui/icons-material/MenuBook"; // Course Icon
import Box from "@mui/material/Box";

const TeacherAndCourseCard = ({ totalTeachers, totalCourses }) => {
  return (
    <Card variant="outlined" style={{ boxShadow: "none", textAlign: "center" }} sx={{ p: 2, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Total Teachers & Courses
        </Typography>

        {/* Teacher Icon & Count */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: "#cfe8fc", width: 60, height: 60 }}>
            <AccountCircleIcon sx={{ fontSize: 40, color: "#3f51b5" }} />
          </Avatar>
          <Typography variant="h5" color="primary">
            {totalTeachers} Teachers
          </Typography>
        </Box>

        {/* Course Icon & Count */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <Avatar sx={{ bgcolor: "#ffd8b1", width: 60, height: 60 }}>
            <MenuBookIcon sx={{ fontSize: 40, color: "#ff9800" }} />
          </Avatar>
          <Typography variant="h5" color="secondary">
            {totalCourses} Courses
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const TotalTeachersAndCourses = () => {
  const totalTeachers = 25; // Replace with API data
  const totalCourses = 10; // Replace with API data

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
        <TeacherAndCourseCard totalTeachers={totalTeachers} totalCourses={totalCourses} />
      </Grid>
    </Grid>
  );
};

export default TotalTeachersAndCourses;
