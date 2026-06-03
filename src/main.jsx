import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import App from './App';
import  client  from './apollo'; // Ensure this points to your client instance
import "./index.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ApolloProvider provides GraphQL capabilities */}
    <ApolloProvider client={client}>
      {/* BrowserRouter provides Routing capabilities to <Routes /> inside App */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);