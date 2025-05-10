import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: "http://localhost:8080/",
  realm: "netzwerk",
  clientId: "react-client",
});

export const initKeycloak = (onAuthenticatedCallback) => {
  return keycloak
    .init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    })
    .then((authenticated) => {
      if (authenticated) {
        setInterval(() => {
          keycloak
            .updateToken(30)
            .catch(() => {
              console.warn('Failed to refresh token');
              keycloak.login();
            });
        }, 10000); 
        onAuthenticatedCallback();
      } else {
        keycloak.login();
      }
    })
    .catch((error) => {
      console.error('Failed to initialize Keycloak', error);
    });
};

export const getKeycloakInstance = () => keycloak;
