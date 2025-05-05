import axios from 'axios';
const keytar = require('keytar');


// Constants for keytar
const SERVICE = 'voyagr';
const ACCOUNT = 'auth0-tokens';

// Token keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ID_TOKEN_KEY = 'id_token';

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

 /**
 * Sets a token in the secure storage
 * @param {string} key - The token key
 * @param {string} value - The token value
 */
async function setToken(key, value) {
  if (value) {
    await keytar.setPassword(SERVICE, `${ACCOUNT}_${key}`, value);
  } else {
    await deleteToken(key);
  }
}

/**
 * Gets a token from secure storage
 * @param {string} key - The token key
 * @returns {Promise<string>} The stored token or null
 */
async function getToken(key) {
  try {
    return await keytar.getPassword(SERVICE, `${ACCOUNT}_${key}`);
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
}

/**
 * Deletes a token from secure storage
 * @param {string} key - The token key
 */
async function deleteToken(key) {
  try {
    await keytar.deletePassword(SERVICE, `${ACCOUNT}_${key}`);
  } catch (error) {
    console.error(`Error deleting ${key}:`, error);
  }
}
  

  const authService = {
    auth0Config,
    getAuthenticationURL,
    setToken,
    getToken,
    deleteToken
  };
  
  export default authService;