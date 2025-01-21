import React from "react";
import Grid from "@mui/material/Grid";


import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

const TopPerformerCard = ({ name, faculty, year }) => {
  return (
    <Card variant="outlined" style={{ boxShadow: 'none' }} sx={{ display: "flex", alignItems: "center", p: 2, height: "100%" }}>
      <Avatar sx={{ width: 80, height: 80, marginRight: 2 }}>
        {name[0]} {/* Use the first letter of the name as the avatar icon */}
      </Avatar>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Top Performer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Name:</strong> {name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Faculty:</strong> {faculty}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <strong>Year:</strong> {year}
        </Typography>
      </CardContent>
    </Card>
  );
};



const topPerformers = [
  {
    id: 1,
    name: "Raju Thapa",
    faculty: "CSIT",
    year: "3rd Sem",
  },
  {
    id: 2,
    name: "Suman Regmi",
    faculty: "BCA",
    year: "4th Sem",
  },
  {
    id: 3,
    name: "Tirtha Pokhrel",
    faculty: "BBM",
    year: "2nd Sem",
  },
];

const TopPerformers = () => {
  return (
    <Grid container spacing={2}>
      {topPerformers.map((performer) => (
        <Grid item lg={4} xs={12} md={12} key={performer.id}>
          <TopPerformerCard
            name={performer.name}
            faculty={performer.faculty}
            year={performer.year}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TopPerformers;
