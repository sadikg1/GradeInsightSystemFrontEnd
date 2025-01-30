import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Typography } from '@mui/material';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CourseAverageCard = () => {
  // Static course averages data
  const data = {
    labels: ['CSIT 101', 'BCA 201', 'BBM 301'], // Course names
    datasets: [
      {
        label: 'Average Marks',
        data: [68, 72, 65], // Average marks
        borderColor: '#4caf50', // Green color
        backgroundColor: 'rgba(76, 175, 80, 0.2)', // Light green fill
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false
      },
      legend: {
        position: 'top'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Courses'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Average Marks'
        },
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <Card sx={{ borderRadius: '10px' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Course Averages
        </Typography>
        <div style={{ height: 300 }}>
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseAverageCard;