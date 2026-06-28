import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';

interface DatePickerFieldProps {
  label: string;
  value: string; // ISO string
  onChange: (date: string) => void;
  disablePast?: boolean;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  disablePast = true 
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={label}
        value={value ? moment(value) : null}
        onChange={(newValue: moment.Moment | null) => {
          if (newValue) {
            onChange(newValue.toISOString());
          } else {
            onChange('');
          }
        }}
        disablePast={disablePast}
        slotProps={{
          textField: {
            fullWidth: true,
            margin: 'normal',
            variant: 'outlined',
            size: 'small',
            slotProps: { inputLabel: { shrink: true } } as any
          }
        }}
      />
    </LocalizationProvider>
  );
};
