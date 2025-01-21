import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { deleteData } from 'apiHandler/apiHandler';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24, 
  borderRadius:5,
  p: 4
};

const DeleteModal = ({ deleteModalVisible, setDeleteModalVisible, handleDeleteCardId, name, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    if(!loading)
    setDeleteModalVisible(false);
  }

  const handleDeletion = async () => {
    try {
      
      await deleteData(`/${name}/${handleDeleteCardId}`);
      setDeleteModalVisible(false);
     
    
      fetchData();
    } catch (err) {
      console.error('Error deleting data:', err);
      
    }
  };

  return (
    <Modal
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      open={deleteModalVisible}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <Fade in={deleteModalVisible}>
        <Box sx={style}>
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Delete Confirmation
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this data?
          </Typography>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="error" onClick={handleDeletion} sx={{ mr: 2 }} disabled={loading}>
              Delete
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

DeleteModal.propTypes = {
  deleteModalVisible: PropTypes.bool.isRequired,
  setDeleteModalVisible: PropTypes.func.isRequired,
  handleDeleteCardId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired
};

export default DeleteModal;