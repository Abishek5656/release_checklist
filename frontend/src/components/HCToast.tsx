import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { HCToastProps } from '../types';

export const HCToast: React.FC<HCToastProps> = ({ open, message, severity = 'success', onClose }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%', boxShadow: 3 }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
