# Situation Room Client

A modern web-based election monitoring and incident management platform built with React, Apollo Client, GraphQL, and Tailwind CSS.

## Overview

Situation Room Client provides a user-friendly interface for:

* User Authentication
* Incident Reporting
* Incident Monitoring
* Incident Status Management
* Election Result Submission
* Election Result Aggregation
* Dashboard Analytics
* Polling Unit Management

The application communicates with a GraphQL backend and supports role-based access control.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Role-Based Access Control

### Incident Management

* Create Incident Reports
* View All Incidents
* View Incident Details
* Update Incident Status
* Delete Incidents (Admin Only)

### Election Monitoring

* Polling Unit Management
* Election Result Submission
* Election Result Aggregation
* Winner Calculation
* Dashboard Statistics

### Dashboard

* Total Incidents
* Pending Incidents
* Verified Incidents
* Resolved Incidents
* Election Result Summary

---

## Technology Stack

### Frontend

* React
* React Router DOM
* Apollo Client
* GraphQL
* TypeScript
* Tailwind CSS
* Vite

### Backend Integration

* GraphQL API
* JWT Authentication

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd situationroom-client
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create a `.env` file in the root directory.

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

### Start Development Server

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

## Project Structure

```text
src
│
├── components
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   └── DashboardLayout.tsx
│
├── graphql
│   ├── queries.ts
│   ├── mutations.ts
│   └── apollo.ts
│
├── pages
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── IncidentDashboard.tsx
│   ├── IncidentDetails.tsx
│   ├── CreateIncident.tsx
│   ├── StatusUpdater.tsx
│   └── DashboardHome.tsx
│
├── App.tsx
└── main.tsx
```

---

## Available Scripts

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Authentication

JWT tokens are stored in Local Storage.

Example:

```javascript
localStorage.setItem("token", token);
```

Apollo Client automatically attaches the token to requests.

```javascript
Authorization: Bearer <token>
```

---

## User Roles

### ADMIN

Can:

* View all users
* Create incidents
* Delete incidents
* Update incident status
* Manage polling units
* View election results

### COORDINATOR

Can:

* Create incidents
* Update incident status
* Submit election results
* View dashboards

### OBSERVER

Can:

* Create incidents
* View incidents
* Submit election reports

---

## GraphQL Operations

### Queries

```graphql
getIncidents
getIncident
dashboardStats
getPollingUnits
getResults
electionSummary
```

### Mutations

```graphql
signup
login
createIncident
updateIncidentStatus
deleteIncident
createPollingUnit
updatePollingUnitStatus
submitResult
```

---

## Dashboard Statistics

The dashboard displays:

* Total Incidents
* Pending Incidents
* Verified Incidents
* Resolved Incidents

Data is fetched from:

```graphql
dashboardStats
```

---

## Election Result Calculation

Election results are automatically aggregated by candidate.

Example:

```text
APC  - 52,340 Votes
PDP  - 48,721 Votes
LP   - 21,450 Votes
```

The system automatically determines the candidate with the highest vote count and displays the winner.

---

## Security

* JWT Authentication
* Role-Based Authorization
* Protected Routes
* GraphQL Authorization Checks
* Secure Password Hashing (Backend)

---

## Future Improvements

* Real-time Updates
* Notifications
* Charts and Analytics
* Export Reports
* Offline Support
* Mobile Application

---

## Author

Developed as an Election Monitoring and Incident Reporting Platform using React, Apollo Client, GraphQL, and Tailwind CSS.

## License

MIT License
