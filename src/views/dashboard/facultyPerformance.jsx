import React from 'react';
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

const MarksMetricCard = ({ title, value, icon, color, trend }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        transition: '0.3s',
        backgroundColor:'rgb(246, 243, 243)',
        borderRadius:'10px'
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
  // Sample data (replace with actual API data)
  const metricsData = [
    {
      title: 'Average Mark',
      value: '68.4',
      icon: <TrendingUpIcon />,
      color: { background: '#e8f5e9', icon: '#4caf50' },
      trend: 2.4,
      sql: `SELECT AVG(Mark) FROM dbo.Marks`
    },
    {
      title: 'Highest Mark',
      value: '98',
      icon: <EmojiEventsIcon />,
      color: { background: '#fff3e0', icon: '#ef6c00' },
      sql: `SELECT MAX(Mark) FROM dbo.Marks`
    },
    {
      title: 'Lowest Mark',
      value: '22',
      icon: <WarningIcon />,
      color: { background: '#fbe9e7', icon: '#d32f2f' },
      sql: `SELECT MIN(Mark) FROM dbo.Marks`
    },
    {
      title: 'Total Marks Recorded',
      value: '2,456',
      icon: <AssignmentIcon />,
      color: { background: '#e3f2fd', icon: '#1976d2' },
      sql: `SELECT COUNT(MarksId) FROM dbo.Marks`
    },
    {
      title: 'Pass Rate',
      value: '84%',
      icon: <CheckCircleIcon />,
      color: { background: '#e8f5e9', icon: '#2e7d32' },
      sql: `SELECT (COUNT(CASE WHEN Mark >= 40 THEN 1 END) * 100.0 / COUNT(*)) FROM dbo.Marks`
    },
    {
      title: 'Fail Rate',
      value: '16%',
      icon: <CancelIcon />,
      color: { background: '#fce4ec', icon: '#c2185b' },
      sql: `SELECT (COUNT(CASE WHEN Mark < 40 THEN 1 END) * 100.0 / COUNT(*)) FROM dbo.Marks`
    }
  ];

  return (
    <Card sx={{ borderRadius: '10px'}} >
      <CardContent>
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
