import { WebStorageStateStore } from 'oidc-client-ts';

export const oidcConfig = {
  authority: "http://localhost:8090/realms/business-saas",
  client_id: "business-saas-web-frontend-app",
  redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid profile email",
  userStore: new WebStorageStateStore({ store: window.localStorage }), // Crucial for persisting logins across refreshes
  automaticSilentRenew: true, // Automatically renew the token in the background before it expires
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};
