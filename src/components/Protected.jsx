import React from 'react';
import { getKeycloakInstance } from '../services/keycloackService';

const Protected = ({ children }) => {
  const keycloak = getKeycloakInstance();

  if (!keycloak || !keycloak.authenticated) {
    keycloak.login();
    return <div>Redirecting to login...</div>;
  }

  return children;
};

export default Protected;
