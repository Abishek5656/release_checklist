import { gql } from '@apollo/client';

export const GET_RELEASES = gql`
  query GetReleases {
    getReleases {
      id
      name
      date
      status
      tickets {
        id
        title
        is_completed
      }
    }
  }
`;

export const GET_RELEASE = gql`
  query GetRelease($id: ID!) {
    getRelease(id: $id) {
      id
      name
      date
      additionalInfo
      status
      tickets {
        id
        title
        is_completed
      }
    }
  }
`;

export const CREATE_RELEASE = gql`
  mutation CreateRelease($input: CreateReleaseInput!) {
    createRelease(input: $input) {
      id
      name
      date
    }
  }
`;

export const UPDATE_RELEASE = gql`
  mutation UpdateRelease($input: UpdateReleaseInput!) {
    updateRelease(input: $input) {
      id
      additionalInfo
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($id: ID!, $isCompleted: Boolean, $title: String) {
    updateTicket(id: $id, isCompleted: $isCompleted, title: $title) {
      id
      is_completed
      title
    }
  }
`;

export const DELETE_TICKET = gql`
  mutation DeleteTicket($id: ID!) {
    deleteTicket(id: $id)
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTicket($releaseId: ID!, $title: String!) {
    createTicket(releaseId: $releaseId, title: $title) {
      id
      title
      is_completed
    }
  }
`;

export const DELETE_RELEASE = gql`
  mutation DeleteRelease($id: ID!) {
    deleteRelease(id: $id)
  }
`;
