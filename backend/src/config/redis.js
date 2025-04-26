const { createClient } = require('redis');

const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = createClient({ url: redisURL });

// Connect to Redis
redisClient.connect().catch(console.error);

// Handle connection events
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

module.exports = redisClient;