const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { logToAPI } = require('./logger');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Middleware to log all requests
app.use((req, res, next) => {
    logToAPI('info', `Request: ${req.method} ${req.url}`);
    next();
});

app.use(express.static('public')); // Serve frontend files

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/gyms', require('./routes/gymRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Root route fallback / Health check
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3005;

// Global Error Handlers to prevent crash
process.on('unhandledRejection', (err) => {
    logToAPI('error', `Unhandled Rejection: ${err.message}`);
    console.log(`Error: ${err.message}`);
});

process.on('uncaughtException', (err) => {
    logToAPI('error', `Uncaught Exception: ${err.message}`);
    console.log(`Error: ${err.message}`);
});

app.listen(PORT, '0.0.0.0', () => {
    const startMsg = `Gym Project Server running on http://0.0.0.0:${PORT}`;
    console.log(startMsg);
    logToAPI('info', startMsg);
});
