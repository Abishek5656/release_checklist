import type { AlertColor } from '@mui/material';

export interface HCToastProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  onClose: () => void;
}


export interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
}