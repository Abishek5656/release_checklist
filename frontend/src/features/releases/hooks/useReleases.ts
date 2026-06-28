import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RELEASES, GET_RELEASE, CREATE_RELEASE, DELETE_RELEASE, UPDATE_RELEASE, UPDATE_TICKET, CREATE_TICKET, DELETE_TICKET } from '../domain/queries';
import { useDate } from '../../../hooks/useDate';
import type { Release, Ticket } from '../types';

export function useReleases() {
  const { data, loading, error, refetch } = useQuery<{ getReleases: Release[] }>(GET_RELEASES, {
    fetchPolicy: 'network-only'
  });
  const [deleteReleaseMutation] = useMutation(DELETE_RELEASE);

  const deleteRelease = async (id: string) => {
    await deleteReleaseMutation({ variables: { id } });
    refetch();
  };

  return {
    releases: data?.getReleases || [],
    loading,
    error,
    deleteRelease,
    refetch
  };
}

export function useCreateRelease() {
  const [createReleaseMutation] = useMutation(CREATE_RELEASE);
  
  const createRelease = async (name: string, date: string) => {
    await createReleaseMutation({ 
      variables: { input: { name, date } },
      refetchQueries: [{ query: GET_RELEASES }]
    });
  };

  return { createRelease };
}

export function useReleaseDetailLogic(id: string, onDeleted: () => void) {
  const { data, loading, refetch } = useQuery<{ getRelease: Release }>(GET_RELEASE, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only'
  });

  const [updateRelease] = useMutation(UPDATE_RELEASE);
  const [updateTicketMutation] = useMutation(UPDATE_TICKET);
  const [createTicketMutation] = useMutation(CREATE_TICKET);
  const [deleteTicketMutation] = useMutation(DELETE_TICKET);
  const [deleteReleaseMutation] = useMutation(DELETE_RELEASE);

  const [additionalInfo, setAdditionalInfo] = useState('');
  const release = data?.getRelease;
  const { formatDate } = useDate();
  const formattedDate = release?.date ? formatDate(release.date) : '';

  useEffect(() => {
    if (release) {
      setAdditionalInfo(release.additionalInfo || '');
    }
  }, [release]);

  const handleToggleStep = async (ticket: Ticket) => {
    await updateTicketMutation({ 
      variables: { id: ticket.id, isCompleted: !ticket.is_completed }
    });
    refetch();
  };

  const handleEditTicket = async (id: string, title: string) => {
    if (title.trim()) {
      await updateTicketMutation({
        variables: { id, title: title.trim() }
      });
      refetch();
    }
  };

  const handleDeleteTicket = async (id: string) => {
    await deleteTicketMutation({ variables: { id } });
    refetch();
  };

  const handleCreateTicket = async (title: string) => {
    if (release && title.trim()) {
      await createTicketMutation({
        variables: { releaseId: release.id, title: title.trim() }
      });
      refetch();
    }
  };

  const handleSave = async () => {
    if (release) {
      await updateRelease({
        variables: { input: { id: release.id, additionalInfo } }
      });
      refetch();
    }
  };

  const handleDelete = async () => {
    if (release) {
      await deleteReleaseMutation({ variables: { id: release.id } });
      onDeleted();
    }
  };

  return {
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
  };
}
