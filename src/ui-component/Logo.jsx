// material-ui
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import logo from 'assets/images/logo.png';

const Logo = () => {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center">
      <img src={logo} alt="Berry" width="50" />
      <Typography
        variant="h6"
        sx={{ marginLeft: 1, fontWeight: 'bold', color: theme.palette.text.primary }}
      >
        GradeInsight
      </Typography>
    </Box>
  );
};

export default Logo;
