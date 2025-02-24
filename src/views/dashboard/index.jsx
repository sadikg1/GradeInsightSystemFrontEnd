import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import FacultyTotal from './facultyTotalStudentsCard';
import TeacherAndCourseTotal from './totalTeacherAndCourseCard';
import MarksCards from './marksCards';
import CourseAvgMarks from './courseAvgBarChart';
import { gridSpacing } from 'store/constant';
import {} from '@mui/material';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      {/* First Row: Total Student in Faculty*/}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={12} md={12} sm={12} xs={12} sx={{ height: '100%' }}>
            <FacultyTotal />
          </Grid>
        </Grid>
      </Grid>
      {/* Second Row: Total Teachers,Course and Faculty*/}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={12} md={12} sm={12} xs={12} sx={{ height: '100%' }}>
            <TeacherAndCourseTotal />
          </Grid>
        </Grid>
      </Grid>

      {/* Third Row: Marks Insight and Faculty&Semester wise CourseAveragemarks Performance*/}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={6} md={12} sm={12} xs={12} sx={{ height: '100%' }}>
            <MarksCards />
          </Grid>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <CourseAvgMarks />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
