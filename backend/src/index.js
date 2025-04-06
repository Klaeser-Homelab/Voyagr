require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
//const { authMiddleware, handleAuth0User, authRoutes } = require('./middleware/auth');
const sequelize = require('./config/database');
const habitRoutes = require('./routes/habits');
const valueRoutes = require('./routes/values');
const eventRoutes = require('./routes/events');
const todoRoutes = require('./routes/todos');
const userRoutes = require('./routes/users');
const router = express.Router();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production'
}));

app.use(express.json());

// Make sure this is BEFORE the session middleware
app.set('trust proxy', 1);

// Session middleware
if (process.env.NODE_ENV === 'production' && !process.env.BACKEND_SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in production');
}

app.use(session({
  secret: process.env.BACKEND_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    ...(process.env.NODE_ENV === 'production' && { domain: 'voyagr.me' })
  }
}));

// Auth routes (including test route)
//app.use(authRoutes);

// Use the routes
app.use(habitRoutes);
app.use(valueRoutes);
app.use(eventRoutes);
app.use(todoRoutes);
app.use(userRoutes);
// Initialize database and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer(); 