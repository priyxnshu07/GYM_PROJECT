const axios = require('axios');

const LOG_API_URL = 'http://127.0.0.1:8000/ingest/';

/**
 * Sends a log to the Intelligent Log Analyzer API
 * @param {string} level - 'info', 'warning', or 'error'
 * @param {string} message - The log message
 */
const logToAPI = async (level, message) => {
    try {
        await axios.post(LOG_API_URL, {
            timestamp: new Date().toISOString(),
            level: level,
            message: message
        });
        console.log(`[API Log] Sent ${level}: ${message}`);
    } catch (error) {
        console.error(`[API Log Error] Could not send log to API: ${error.message}`);
    }
};

module.exports = { logToAPI };
