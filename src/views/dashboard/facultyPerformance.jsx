import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const FacultyPerformance = () => {
  const performanceData = [
    { faculty: 'CSIT', passRate: 85, avgPercentage: 65 },
    { faculty: 'BCA', passRate: 78, avgPercentage: 70 },
    { faculty: 'BBM', passRate: 92, avgPercentage: 60 }
  ];

  return (
    <Card sx={{ p: 2, mb: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Faculty Performance Overview
        </Typography>
        <ResponsiveContainer width="100%" height={370}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="faculty" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passRate" fill="#ff0000" name="Pass Rate (%)" />
            <Bar dataKey="avgPercentage" fill="#ffc107" name="Average Percentage" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FacultyPerformance;
