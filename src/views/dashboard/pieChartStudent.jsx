import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Box, CardContent,Card } from '@mui/material';

export default function BasicPie() {
  return (
    <Card
    variant="outlined"
      style={{
        width: "450px",
        textAlign: "center",
        padding: "10px",
        boxShadow: "none",
        borderRadius: "8px",
      }}>
      <CardContent>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Pie Chart Showing Student Numbers by Faculty
          </Typography>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 150,color:'#ff0000', label: 'CSIT' },
                  { id: 1, value: 100, color:'#ffc107', label: 'BCA' },
                  { id: 2, value: 50, color:'#dc3545',label: 'BBM' }
                ]
              }
            ]}
            width={400}
            height={200}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
