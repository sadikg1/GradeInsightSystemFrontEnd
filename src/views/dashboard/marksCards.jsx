import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';
import { getData } from 'apiHandler/apiHandler';

const MarksMetricCard = ({ title, value, icon, color, trend }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        transition: '0.3s',
        backgroundColor: 'rgb(246, 243, 243)',
        borderRadius: '10px'
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2.5 }}>
        <Avatar
          sx={{
            bgcolor: color.background,
            width: 48,
            height: 48,
            mr: 2,
            color: color.icon
          }}
        >
          {icon}
        </Avatar>
        <div>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={600} sx={{ mt: 0.5 }}>
            {value}
            {trend && (
              <Typography
                component="span"
                variant="caption"
                sx={{
                  ml: 1,
                  color: trend > 0 ? theme.palette.success.main : theme.palette.error.main
                }}
              >
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </Typography>
            )}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

const MarksCards = () => {
  const [resultInsight, setResultInsight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData('marks/resultInsight');
        setResultInsight(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Check if data is still loading
  if (!resultInsight) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  // Dynamically populate metricsData with API response
  const metricsData = [
    {
      title: 'Average Mark',
      value: resultInsight['Average Mark'] || 'N/A',
      icon: <TrendingUpIcon />,
      color: { background: '#e8f5e9', icon: '#4caf50' }
    },
    {
      title: 'Highest Mark',
      value: resultInsight['Highest Mark'] || 'N/A',
      icon: <EmojiEventsIcon />,
      color: { background: '#fff3e0', icon: '#ef6c00' }
    },
    {
      title: 'Lowest Mark',
      value: resultInsight['Lowest Mark'] || 'N/A',
      icon: <WarningIcon />,
      color: { background: '#fbe9e7', icon: '#d32f2f' }
    },
    {
      title: 'Total Marks Recorded',
      value: resultInsight['Total Marks Recorded'] || 'N/A',
      icon: <AssignmentIcon />,
      color: { background: '#e3f2fd', icon: '#1976d2' }
    },
    {
      title: 'Pass Rate',
      value: resultInsight['Pass Rate'] || 'N/A',
      icon: <CheckCircleIcon />,
      color: { background: '#e8f5e9', icon: '#2e7d32' }
    },
    {
      title: 'Fail Rate',
      value: resultInsight['Fail Rate'] || 'N/A',
      icon: <CancelIcon />,
      color: { background: '#fce4ec', icon: '#c2185b' }
    }
  ];

  return (
    <Card sx={{ border: '2px solid #ccc',borderRadius: '10px', height: 450 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333', mb: 3, textAlign: 'center' }}>
          Marks Insight
        </Typography>
        <Grid container spacing={3}>
          {metricsData.map((metric, index) => (
            <Grid item xs={12} sm={6} md={4} lg={6} key={index}>
              <MarksMetricCard title={metric.title} value={metric.value} icon={metric.icon} color={metric.color} trend={metric.trend} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MarksCards;
