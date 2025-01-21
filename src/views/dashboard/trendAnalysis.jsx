import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent } from '@mui/material';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrendAnalysis = () => {
  const [data, setData] = useState({
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'], // Static Semesters

    datasets: [
      {
        label: 'CSIT',
        data: [70, 75, 80, 85, 90, 85, 88, 92], // Static Data for Maths
        borderColor: '#ff0000', // Color for the line
        backgroundColor: 'rgba(255, 111, 97, 0.2)', // Fill color for the line area
        fill: true,
        tension: 0.4
      },
      {
        label: 'BCA',
        data: [60, 65, 70, 72, 78, 80, 82, 86], // Static Data for Science
        borderColor: '#ffc107',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'BBM',
        data: [55, 60, 65, 70, 74, 67, 65, 54], // Static Data for History
        borderColor: '#dc3545',
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  });

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Trend Analysis of Faculty Performance Over Semesters'
      },
      legend: {
        position: 'top'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Semesters'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Average Passed Students (%)'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <div>
          <h3>Faculty Performance Trend</h3>
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;
