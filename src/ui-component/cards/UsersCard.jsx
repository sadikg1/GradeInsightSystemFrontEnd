import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { FaEdit, FaTrash, FaUser, FaEnvelope, FaBuilding } from 'react-icons/fa';
import { MdMoreVert } from 'react-icons/md';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: theme.spacing(2),
  boxShadow: theme.shadows[3],
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)'
  },
  height: 250
}));

const UsersCard = ({ id, fullName, username, email, department, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledCard style={{ height: '230px' }}>
      <CardHeader
        style={{ background: 'linear-gradient(135deg, #1e3c73 0%, #162D54 100%)' }}
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                maxWidth: 'calc(100% - 40px)',
                fontSize: '1rem',
                color: '#ffffff'
              }}
            >
              {fullName}
            </Typography>
            <IconButton onClick={handleMenuOpen}>
              <MdMoreVert color="#ffffff" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onEdit(id);
                }}
                sx={{ color: 'primary.main' }}
              >
                <FaEdit style={{ marginRight: 8 }} /> Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onDelete(id);
                }}
                sx={{ color: 'error.main' }}
              >
                <FaTrash style={{ marginRight: 8 }} /> Delete
              </MenuItem>
            </Menu>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <FaUser style={{ marginRight: 8, color: '#28A745' }} />
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
            {username}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <FaEnvelope style={{ marginRight: 8, color: '#007BFF' }} />
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
            {email}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <FaBuilding style={{ marginRight: 8 }} />
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
            {department}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

UsersCard.propTypes = {
  id: PropTypes.number.isRequired,
  fullName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default UsersCard;
