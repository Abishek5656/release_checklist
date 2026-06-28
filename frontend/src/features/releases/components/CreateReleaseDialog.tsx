import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button
} from '@mui/material';
import { UI_STRINGS } from '../../../lib/constants';
import type { CreateReleaseDialogProps } from '../types';
import { useCreateRelease } from '../hooks/useCreateRelease';
import { DatePickerField } from '../../../components/DatePickerField';

export const CreateReleaseDialog: React.FC<CreateReleaseDialogProps> = ({ open, onClose, onSubmit }) => {
  const { newRelease, setNewRelease, handleCreate } = useCreateRelease(onClose, onSubmit);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{UI_STRINGS.CREATE_RELEASE_TITLE}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
        <TextField 
          label={UI_STRINGS.RELEASE_NAME_LABEL}
          value={newRelease.name}
          onChange={(e) => setNewRelease({ ...newRelease, name: e.target.value })}
        />
        <DatePickerField 
          label={UI_STRINGS.RELEASE_DATE_LABEL}
          value={newRelease.date}
          onChange={(date) => setNewRelease({ ...newRelease, date })}
          disablePast={true}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{UI_STRINGS.CANCEL_BTN}</Button>
        <Button variant="contained" onClick={handleCreate} disabled={!newRelease.name || !newRelease.date}>{UI_STRINGS.CREATE_BTN}</Button>
      </DialogActions>
    </Dialog>
  );
};
