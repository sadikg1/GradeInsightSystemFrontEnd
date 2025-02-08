import React from "react";
import { Typography, Container } from "@mui/material";

const UnAuthorized = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        mt: 10,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="h6" color="textSecondary">
        Sorry, you are not allowed to access this page.
      </Typography>
    </Container>
  );
};

export default UnAuthorized;
