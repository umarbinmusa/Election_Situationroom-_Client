import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!, $role: String!, $email: String, $full_name: String) {
    signup(username: $username, password: $password, role: $role, email: $email, full_name: $full_name) {
      token
      user {
        id
        username
        email
        full_name
        role
      }
    }
  }
`;
export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        role
        email
        full_name
      }
    }
  }
`;
export const CREATE_INCIDENT_MUTATION = gql`
  mutation CreateIncident($title: String!, $description: String!, $category: String!, $location: String!) {
    createIncident(title: $title, description: $description, category: $category, location: $location) {
      id
      title
      category
      description
      location
    }
  }
`;


export const DELETE_INCIDENT_MUTATION = gql`
  mutation DeleteIncident($id: ID!) {
    deleteIncident(id: $id)
  }
`;
export const UPDATE_INCIDENT_STATUS_MUTATION = gql`
  mutation UpdateIncidentStatus(
    $id: ID!
    $status: String!
  ) {
    updateIncidentStatus(
      id: $id
      status: $status
    ) {
      id
      status
    }
  }
`;
export const UPDATE_POLLING_UNIT_STATUS = gql`
  mutation UpdatePollingUnitStatus($id: ID!, $status: String!) {
    updatePollingUnitStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;
export const CREATE_POLLING_UNIT = gql`
  mutation CreatePollingUnit($name: String!, $code: String!, $state: String!, $lga: String!) {
    createPollingUnit(name: $name, code: $code, state: $state, lga: $lga) {
      id
      name
      code
      state
      lga
      status
    }
  }
`;

export const SUBMIT_RESULT = gql`
  mutation SubmitResult(
    $pollingUnit: String!
    $electionType: ElectionType!
    $candidate: Candidate!
    $votes: Int!
  ) {
    submitResult(
      pollingUnit: $pollingUnit
      electionType: $electionType
      candidate: $candidate
      votes: $votes
    ) {
      id
      pollingUnit
      electionType
      candidate
      votes
      submittedBy {
        id
        full_name
        username
        email
        role
      }
    }
  }
`;
export const CREATE_LGA_DIRECTOR_MUTATION = gql`
  mutation CreateLGADirector(
    $username: String!
    $password: String!
    $email: String
    $full_name: String!
    $lga: String!
  ) {
    createLGADirector(
      username: $username
      password: $password
      email: $email
      full_name: $full_name
      lga: $lga
    ) {
      id
      username
      full_name
      email
      role
      state
      lga
    }
  }
`;
export const CREATE_WARD_DIRECTOR_MUTATION = gql`
  mutation CreateWardDirector(
    $username: String!
    $password: String!
    $email: String
    $full_name: String!
    $ward: String!
  ) {
    createWardDirector(
      username: $username
      password: $password
      email: $email
      full_name: $full_name
      ward: $ward
    ) {
      id
      username
      full_name
      email
      role
      state
      lga
      ward
    }
  }
`;
export const CREATE_POLLING_UNIT_OFFICER_MUTATION = gql`
  mutation CreatePollingUnitOfficer(
    $username: String!
    $password: String!
    $email: String
    $full_name: String!
    $pollingUnit: String!
  ) {
    createPollingUnitOfficer(
      username: $username
      password: $password
      email: $email
      full_name: $full_name
      pollingUnit: $pollingUnit
    ) {
      id
      username
      full_name
      email
      role
      state
      lga
      ward
      pollingUnit
    }
  }
`;



