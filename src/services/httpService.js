import axios from 'axios';
import { getKeycloakInstance } from '../services/keycloackService';

const apiClient = axios.create({
  baseURL: 'http://localhost:5094/api',
});

apiClient.interceptors.request.use(
  async (config) => {
    const keycloak = getKeycloakInstance();

    if (keycloak.authenticated && keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
