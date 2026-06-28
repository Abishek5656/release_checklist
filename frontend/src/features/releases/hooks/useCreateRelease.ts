import { useState } from 'react';
import { useDate } from '../../../hooks/useDate';

export const useCreateRelease = (onClose: () => void, onSubmit: (name: string, date: string) => void) => {
  const [newRelease, setNewRelease] = useState({ name: '', date: '' });
  const { toISO } = useDate();

  const handleCreate = () => {
    if (newRelease.name && newRelease.date) {
      onSubmit(newRelease.name, toISO(newRelease.date));
      setNewRelease({ name: '', date: '' });
      onClose();
    }
  };

  return {
    newRelease,
    setNewRelease,
    handleCreate
  };
};
