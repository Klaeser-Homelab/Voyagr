require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { authMiddleware, handleAuth0User, authRoutes } = require('./middleware/auth');
const sequelize = require('./config/database');
const habitRoutes = require('./routes/habits');
const valueRoutes = require('./routes/values');
const eventRoutes = require('./routes/events');
const todoRoutes = require('./routes/todos');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Auth0 middleware
app.use(authMiddleware);
app.use(handleAuth0User);

// Auth routes (including test route)
app.use('/auth', authRoutes);

// Use the routes
app.use(habitRoutes);
app.use(valueRoutes);
app.use(eventRoutes);
app.use(todoRoutes);

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