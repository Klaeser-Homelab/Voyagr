require('dotenv').config();

// Set timezone to UTC immediately after loading environment variables
process.env.TZ = 'UTC';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const {RedisStore} = require("connect-redis")
const sequelize = require('./config/database');
const habitRoutes = require('./routes/habits');
const valueRoutes = require('./routes/values');
const eventRoutes = require('./routes/events');
const todoRoutes = require('./routes/todos');
const userRoutes = require('./routes/users');
const breakRoutes = require('./routes/breaks');
const scheduleRoutes = require('./routes/schedules');
const redis = require('./config/redis');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'capacitor-electron://-'],
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'
}));

console.log('CORS middleware configuration:', {
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'capacitor-electron://-'],
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'
});

app.use(express.json());

// Make sure this is BEFORE the session middleware
app.set('trust proxy', 1);
const jwtCheck = auth({
  audience: 'https://voyagr.me/auth',
  issuerBaseURL: 'https://dev-m0q23jbgtbwidn00.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

app.use(jwtCheck);

// Session middleware
if (process.env.NODE_ENV === 'production' && !process.env.BACKEND_SESSION_SECRET) {
  console.log('Node ENV:', process.env.NODE_ENV);
  console.log('BACKEND_SESSION_SECRET:', process.env.BACKEND_SESSION_SECRET);
  throw new Error('SESSION_SECRET must be set in production');
}

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.BACKEND_SESSION_SECRET, // replace with your own secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

console.log('Session middleware configuration:', {
  secret: process.env.BACKEND_SESSION_SECRET ? '****' : 'not set', // Mask the secret for security
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24,
    domain:'not set'
  }
});

// Use the routes
app.use(habitRoutes);
app.use(valueRoutes);
app.use(eventRoutes);
app.use(todoRoutes);
app.use(userRoutes);
app.use(breakRoutes);
app.use(scheduleRoutes);
// Initialize database and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (creates tables if they don't exist)
    await sequelize.sync();
    console.log('Database synchronized.');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};


const listRoutes = (app) => {
  console.log("Listing routes");
  app._router.stack.forEach((middleware) => {
    if (middleware.route) { // Routes registered directly on the app
      console.log(`${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') { // Router middleware
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          console.log(`${route.stack[0].method.toUpperCase()} ${route.path}`);
        }
      });
    }
  });
};

// List all routes
listRoutes(app);

startServer(); 