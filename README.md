# Gym Project

This is a comprehensive platform for finding and booking gym sessions and trainers.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)
- MongoDB connection string (see Configuration)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd GYM_PROJECT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory.
2. Add your MongoDB connection string and other environment variables (ask the team lead for the template).

## Running the Application

To run the application in development mode:

```bash
npm start
```

The server will typically start on `http://localhost:3000` (or the port specified in your `.env` file).

## Testing

Run Cypress e2e tests:

```bash
npx cypress open
```
