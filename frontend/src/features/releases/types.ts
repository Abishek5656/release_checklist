export interface Ticket {
  id: string;
  title: string;
  is_completed: boolean;
}

export interface Release {
  id: string;
  name: string;
  date: string;
  additionalInfo: string;
  tickets: Ticket[];
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReleaseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, date: string) => void;
}
