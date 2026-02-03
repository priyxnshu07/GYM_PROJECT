const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        supportFile: false // For simplicity in lab environment
    },
});
