import React, { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton
} from '@mui/material';
import { Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useReleases, useCreateRelease } from '../hooks/useReleases';
import { CreateReleaseDialog } from '../components/CreateReleaseDialog';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { UI_STRINGS } from '../../../lib/constants';
import type { Release } from '../types';

const statusMap = [UI_STRINGS.STATUS_PLANNED, UI_STRINGS.STATUS_ONGOING, UI_STRINGS.STATUS_DONE];

export const ListReleasesScreen: React.FC = () => {
  const { releases, loading, deleteRelease } = useReleases();
  const { createRelease } = useCreateRelease();
  const navigate = useNavigate();

  const [openNew, setOpenNew] = useState(false);

  if (loading) return <LoadingScreen message={UI_STRINGS.LOADING_RELEASES} />;

  const handleCreate = async (name: string, date: string) => {
    await createRelease(name, date);
    setOpenNew(false);
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a24' }}>{UI_STRINGS.APP_TITLE}</Typography>
        <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>{UI_STRINGS.APP_SUBTITLE}</Typography>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', width: '100%', minWidth: { xs: '100%', sm: 600, md: 800 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
          <Typography sx={{ fontWeight: 600, color: '#6366f1' }}>{UI_STRINGS.ALL_RELEASES}</Typography>
          <Button variant="contained" onClick={() => setOpenNew(true)} sx={{ borderRadius: 1, textTransform: 'none', px: 3, boxShadow: 'none' }}>
            {UI_STRINGS.NEW_RELEASE_BTN}
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>{UI_STRINGS.RELEASE_LABEL}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>{UI_STRINGS.DATE_LABEL}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#333' }}>{UI_STRINGS.STATUS_LABEL}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#333' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {releases.map((release: Release) => (
              <TableRow key={release.id}>
                <TableCell>{release.name}</TableCell>
                <TableCell>{format(new Date(parseInt(release.date)), 'MMMM d, yyyy')}</TableCell>
                <TableCell>
                  <Typography variant="body2">{statusMap[release.status]}</Typography>
                </TableCell>
                <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: '#555' }} onClick={() => navigate(`/release/${release.id}`)}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>View</Typography>
                        <Eye size={18} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: '#555' }} onClick={() => deleteRelease(release.id)}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Delete</Typography>
                        <Trash2 size={18} />
                      </Box>
                    </Box>
                </TableCell>
              </TableRow>
            ))}
            {releases.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">{UI_STRINGS.NO_RELEASES}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </TableContainer>
      </Paper>

      {/* New Release Dialog */}
      <CreateReleaseDialog 
        open={openNew} 
        onClose={() => setOpenNew(false)} 
        onSubmit={handleCreate} 
      />
    </Box>
  );
};
