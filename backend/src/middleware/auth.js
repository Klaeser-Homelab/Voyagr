const { expressjwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

/*
// Auth0 token validation middleware
const requireAuth = expressjwt({
  // Dynamically fetch the public key using JWKS
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-m0q23jbgtbwidn00.us.auth0.com/.well-known/jwks.json`
  }),
  
  // Validate audience and issuer
  audience: 'https://dev-m0q23jbgtbwidn00.us.auth0.com/api/v2/', // The identifier you set up in Auth0 for your API
  issuer: `https://dev-m0q23jbgtbwidn00.us.auth0.com`,
  algorithms: ['RS256']
});
*/

const getToken = (req) => {
  return req.headers.authorization.split(' ')[1];
};

module.exports = { getToken };