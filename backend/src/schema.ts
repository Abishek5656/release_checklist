export const typeDefs = `#graphql
  type Ticket {
    id: ID!
    title: String!
    is_completed: Boolean!
  }

  type Release {
    id: ID!
    name: String!
    date: String!
    additionalInfo: String
    tickets: [Ticket!]!
    status: Int!
    createdAt: String!
    updatedAt: String!
  }

  input CreateReleaseInput {
    name: String!
    date: String!
    additionalInfo: String
  }

  input UpdateReleaseInput {
    id: ID!
    additionalInfo: String
  }

  type Query {
    getReleases: [Release!]!
    getRelease(id: ID!): Release
  }

  type Mutation {
    createRelease(input: CreateReleaseInput!): Release!
    updateRelease(input: UpdateReleaseInput!): Release!
    updateTicket(id: ID!, isCompleted: Boolean, title: String): Ticket!
    createTicket(releaseId: ID!, title: String!): Ticket!
    deleteTicket(id: ID!): Boolean!
    deleteRelease(id: ID!): Boolean!
  }
`;
