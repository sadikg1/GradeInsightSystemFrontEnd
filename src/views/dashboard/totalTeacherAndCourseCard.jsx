import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useTheme } from '@mui/material/styles';

const InfoCard = ({ title, value, icon, color }) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        height: '100%',
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '10px'
      }}
    >
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
      <CardContent sx={{ flex: 1, p: 1 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const cardData = [
  {
    id: 1,
    title: 'Total Teachers',
    value: '25',
    icon: <PersonIcon />,
    color: {
      background: '#e3f2fd',
      icon: '#1976d2'
    }
  },
  {
    id: 2,
    title: 'Total Courses',
    value: '10',
    icon: <MenuBookIcon />,
    color: {
      background: '#fbe9e7',
      icon: '#d84315'
    }
  },
  {
    id: 3,
    title: 'Total Faculties',
    value: '3',
    icon: <AccountBalanceIcon />,
    color: {
      background: '#e8f5e9',
      icon: '#2e7d32'
    }
  }
];

const AdminDashboardCards = () => {
  return (
    <Grid container spacing={2}>
      {cardData.map((item) => (
        <Grid item key={item.id} lg={4} xs={12} sm={12} md={12}>
          <InfoCard title={item.title} value={item.value} icon={item.icon} color={item.color} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminDashboardCards;
