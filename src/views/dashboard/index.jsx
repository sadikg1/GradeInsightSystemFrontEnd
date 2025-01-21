import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';


import BasicPie from './pieChartStudent';
import TopPerformers from './topPerformer';
import FacultyPerformance from './facultyPerformance';
import TrendAnalysis from './trendAnalysis';
import { gridSpacing } from 'store/constant';
import {  } from '@mui/material';


// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    
      <Grid container spacing={gridSpacing}>
        {/* Second Row: Top Performer*/}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ height: '100%' }}>
              <TopPerformers />
            </Grid>
          </Grid>
        </Grid>

        {/* Third Row: Faculty Performance*/}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={4} md={12} sm={12} xs={12} sx={{ height: '100%' }}>
              <FacultyPerformance />
            </Grid>
            <Grid item lg={8} md={12} sm={12} xs={12} sx={{ height: '100%' }}>
              <TrendAnalysis />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    
  );
};

export default Dashboard;
