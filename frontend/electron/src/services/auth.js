const auth0Config = {
    clientId: 'lpTd0GzL3Qmr2ACZ6CcT1rMN3nkqh1gu',
    domain: 'dev-m0q23jbgtbwidn00.us.auth0.com',
    redirectUri: 'capacitor-electron://-/callback', // Usually something like 'your-app-scheme://callback'
    audience: 'https://dev-m0q23jbgtbwidn00.us.auth0.com/api/v2/',
    scope: 'openid profile email' // Standard OAuth scopes
  };

function getAuthenticationURL() {
    return (
      "https://" +
      auth0Config.domain +
      "/authorize?" +
      "scope=openid profile offline_access&" +
      "response_type=code&" +
      "client_id=" +
      auth0Config.clientId +
      "&" +
      "redirect_uri=" +
      auth0Config.redirectUri
    );
  }

  export { getAuthenticationURL };