import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      username
      role
    }
  }
`;

export const GET_INCIDENTS_QUERY = gql`
  query GetIncidents {
    getIncidents {
      id
      title
      description
      category
      status
      location
      reportedBy {
        id
        username
        role
      }
    }
  }
`;
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalIncidents
      pendingIncidents
      verifiedIncidents
      resolvedIncidents
    }
  }
`;
export const GET_POLLING_UNITS = gql`
  query GetPollingUnits {
    getPollingUnits {
      id
      name
      code
      state
      lga
      status
    }
  }
`;
export const GET_RESULTS = gql`
  query GetResults {
    getResults {
      id
      pollingUnit
      candidate
      votes
      submittedBy {
        id
        username
        email
        full_name
        role
      }
    }
  }
`;

export const GET_ELECTION_SUMMARY = gql`
  query ElectionSummary {
    electionSummary {
      winner
      totalVotes
      results {
        candidate
        totalVotes
      }
    }
  }
`;

