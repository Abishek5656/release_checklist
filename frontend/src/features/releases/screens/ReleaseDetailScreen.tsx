import React, { useState } from 'react';
import { 
  Box, Typography, Button, Paper, TextField, 
  FormGroup, FormControlLabel, Checkbox, IconButton
} from '@mui/material';
import { ChevronRight, Pencil, Trash2, Check, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReleaseDetailLogic } from '../hooks/useReleases';
import { RELEASE_STEPS, UI_STRINGS } from '../../../lib/constants';
import { LoadingScreen } from '../../../components/LoadingScreen';
import type { Ticket } from '../types';

const TicketRow: React.FC<{
  ticket: Ticket;
  onToggle: (ticket: Ticket) => void;
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}> = ({ ticket, onToggle, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(ticket.title);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', '&:hover .ticket-actions': { opacity: 1 } }}>
      <FormControlLabel
        control={
          <Checkbox 
            checked={ticket.is_completed} 
            onChange={() => onToggle(ticket)} 
          />
        }
        label={
          isEditing ? (
            <TextField 
              size="small" 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEdit(ticket.id, editValue);
                  setIsEditing(false);
                } else if (e.key === 'Escape') {
                  setEditValue(ticket.title);
                  setIsEditing(false);
                }
              }}
              autoFocus
            />
          ) : (
            ticket.title
          )
        }
      />
      
      {!isEditing && (
        <Box className="ticket-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', display: 'flex', gap: 0.5, ml: 1 }}>
          <IconButton size="small" onClick={() => setIsEditing(true)}>
            <Pencil size={16} />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => onDelete(ticket.id)}>
            <Trash2 size={16} />
          </IconButton>
        </Box>
      )}

      {isEditing && (
        <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
          <IconButton size="small" color="primary" onClick={() => { onEdit(ticket.id, editValue); setIsEditing(false); }}>
            <Check size={16} />
          </IconButton>
          <IconButton size="small" onClick={() => { setEditValue(ticket.title); setIsEditing(false); }}>
            <X size={16} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export const ReleaseDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newTicketTitle, setNewTicketTitle] = useState('');

  const {
    release,
    loading,
    additionalInfo,
    setAdditionalInfo,
    formattedDate,
    handleToggleStep,
    handleCreateTicket,
    handleEditTicket,
    handleDeleteTicket,
    handleSave,
    handleDelete
  } = useReleaseDetailLogic(id!, () => navigate('/'));

  const handleAddTicket = () => {
    if (newTicketTitle.trim()) {
      handleCreateTicket(newTicketTitle);
      setNewTicketTitle('');
    }
  };

  if (loading) return <LoadingScreen message={UI_STRINGS.LOADING_DETAILS} />;
  if (!release) return <Typography>{UI_STRINGS.NOT_FOUND}</Typography>;

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#333' }}>{UI_STRINGS.APP_TITLE}</Typography>
        <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>{UI_STRINGS.APP_SUBTITLE}</Typography>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', width: '100%', minWidth: { xs: '100%', sm: 600, md: 800 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: 600, color: '#6366f1', cursor: 'pointer' }} onClick={() => navigate('/')}>{UI_STRINGS.ALL_RELEASES}</Typography>
            <ChevronRight size={18} color="#999" />
            <Typography sx={{ color: '#666' }}>{release.name}</Typography>
          </Box>
          <Button 
            variant="contained" 
            color="error"
            startIcon={<Trash2 size={16} />}
            onClick={handleDelete}
            sx={{ borderRadius: 1, textTransform: 'none', boxShadow: 'none' }}
          >
            {UI_STRINGS.DELETE_BTN}
          </Button>
        </Box>

        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
            <Box sx={{ flex: 1, maxWidth: 300 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555', mb: 0.5, display: 'block' }}>{UI_STRINGS.RELEASE_LABEL}</Typography>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1.5 }}>
                <Typography sx={{ fontWeight: 500 }}>{release.name}</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1, maxWidth: 300 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555', mb: 0.5, display: 'block' }}>{UI_STRINGS.DATE_LABEL}</Typography>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1.5 }}>
                <Typography sx={{ fontWeight: 500 }}>{formattedDate}</Typography>
              </Box>
            </Box>
          </Box>

          <FormGroup sx={{ mb: 2 }}>
            {release.tickets?.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onToggle={handleToggleStep}
                onEdit={handleEditTicket}
                onDelete={handleDeleteTicket}
              />
            ))}
          </FormGroup>

          <Box sx={{ display: 'flex', gap: 1, mb: 4, width: '100%' }}>
            <TextField
              size="small"
              placeholder="Add new ticket..."
              fullWidth
              value={newTicketTitle}
              onChange={(e) => setNewTicketTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTicket();
              }}
            />
            <Button 
              variant="outlined" 
              onClick={handleAddTicket}
              sx={{ textTransform: 'none', borderRadius: 1 }}
            >
              Add
            </Button>
          </Box>

          <Typography variant="caption" sx={{ fontWeight: 600, color: '#555', mb: 0.5, display: 'block' }}>{UI_STRINGS.ADDITIONAL_REMARKS_LABEL}</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder={UI_STRINGS.ADDITIONAL_REMARKS_PLACEHOLDER}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            sx={{ mb: 4 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 1, px: 4, textTransform: 'none', bgcolor: '#6366f1', boxShadow: 'none' }}>
              {UI_STRINGS.SAVE_BTN}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
