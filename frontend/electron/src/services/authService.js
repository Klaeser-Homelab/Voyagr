import axios from 'axios';

let accessToken = null;

const auth0Config = {
    clientId: 'lpTd0GzL3Qmr2ACZ6CcT1rMN3nkqh1gu',
    domain: 'dev-m0q23jbgtbwidn00.us.auth0.com',
    redirectUri: 'capacitor-electron://-/callback', // Usually something like 'your-app-scheme://callback'
    audience: 'https://dev-m0q23jbgtbwidn00.us.auth0.com/api/v2/',
    scope: 'openid profile email', // Standard OAuth scopes
    homeUrl: 'capacitor-electron://-/home'
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

  async function loadTokens(callbackURL) {
    const urlParts = url.parse(callbackURL, true);
    const query = urlParts.query;
  
    const exchangeOptions = {
      'grant_type': 'authorization_code',
      'client_id': clientId,
      'code': query.code,
      'redirect_uri': redirectUri,
    };
  
    const options = {
      method: 'POST',
      url: `https://${auth0Config.domain}/oauth/token`,
      headers: {
        'content-type': 'application/json'
      },
      data: JSON.stringify(exchangeOptions),
    };
  
    try {
      const response = await axios(options);
      accessToken = response.data.access_token;
    } catch (error) {
      await logout();
  
      throw error;
    }

    if (accessToken) {
      try {
        const response = await axios.post('https://voyagr.me/auth0', 
          {}, // No need to send code anymore
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      } catch (error) {
        throw error;
      }
    }
  }

  const authService = {
    auth0Config,
    getAuthenticationURL,
    loadTokens
  };
  
  export default authService;