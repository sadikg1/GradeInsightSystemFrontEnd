import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, Typography, MenuItem, Select, FormControl, InputLabel, Grid, Box } from '@mui/material';

const CourseAveragesChart = () => {
  // Sample data with BSc. CSIT first and second semester subjects
  const courseData = [
    { course: 'C Programming', avg: 78, faculty: 'BSc. CSIT', semester: 'Sem 1' },
    { course: 'Digital Logic', avg: 82, faculty: 'BSc. CSIT', semester: 'Sem 1' },
    { course: 'Mathematics I', avg: 65, faculty: 'BSc. CSIT', semester: 'Sem 1' },
    { course: 'Physics', avg: 70, faculty: 'BSc. CSIT', semester: 'Sem 1' },
    { course: 'Introduction to IT', avg: 85, faculty: 'BSc. CSIT', semester: 'Sem 1' },
    { course: 'Mathematics II', avg: 68, faculty: 'BSc. CSIT', semester: 'Sem 2' },
    { course: 'Statistics I', avg: 75, faculty: 'BSc. CSIT', semester: 'Sem 2' },
    { course: 'Discrete Math', avg: 74, faculty: 'BSc. CSIT', semester: 'Sem 2' },
    { course: 'Data Structures', avg: 72, faculty: 'BSc. CSIT', semester: 'Sem 2' },
    { course: 'Microprocessor', avg: 80, faculty: 'BSc. CSIT', semester: 'Sem 2' },
  ];

  // State management
  const [selectedFaculty, setSelectedFaculty] = useState('BSc. CSIT');
  const [selectedSemester, setSelectedSemester] = useState('Sem 1');
  const [filteredData, setFilteredData] = useState([]);

  // Get unique faculties and semesters
  const faculties = [...new Set(courseData.map(item => item.faculty))];
  const semesters = [...new Set(courseData
    .filter(item => item.faculty === selectedFaculty)
    .map(item => item.semester)
  )];

  // Update filtered data when filters change
  useEffect(() => {
    const filtered = courseData.filter(item => 
      item.faculty === selectedFaculty && 
      item.semester === selectedSemester
    );
    setFilteredData(filtered);
  }, [selectedFaculty, selectedSemester]);

  return (
    <Card sx={{ p: 3, height: 450, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
        Course Average Marks
      </Typography>

      {/* Filter Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#666' }}>Faculty</InputLabel>
            <Select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              sx={{ bgcolor: '#f5f5f5', borderRadius: '8px' }}
            >
              {faculties.map(faculty => (
                <MenuItem key={faculty} value={faculty}>{faculty}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#666',paddingBottom:'10px' }}>Semester</InputLabel>
            <Select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              sx={{ bgcolor: '#f5f5f5', borderRadius: '8px' }}
            >
              {semesters.map(semester => (
                <MenuItem key={semester} value={semester}>{semester}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="course" 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#ccc' }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#ccc' }}
            />
            <Tooltip 
              contentStyle={{
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #eee'
              }}
            />
            <Bar 
              dataKey="avg" 
              fill="#ef6c00" 
              radius={[4, 4, 0, 0]}
              label={{ 
                position: 'top', 
                fill: '#666',
                fontSize: 12 
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default CourseAveragesChart;