# Selenium Test Instructions

This document guides you through setting up and running the Selenium automation script for the Gym Discovery project.

## Prerequisites

1.  **Python 3**: Ensure Python is installed.
    ```bash
    python3 --version
    ```
2.  **Google Chrome**: Ensure Google Chrome browser is installed.

## Installation

1.  **Install Selenium**:
    ```bash
    pip3 install selenium
    ```
    *(If using a virtual environment, activate it first)*

2.  **ChromeDriver**:
    - **Mac/Linux**: Usually handled automatically by latest selenium versions or `brew install chromedriver`.
    - **Manual**: Download from [Chrome for Testing](https://googlechromelabs.github.io/chrome-for-testing/) matching your Chrome version and add to PATH.

## Running the Test

1.  **Start the Server**:
    Ensure the Gym Project server is running on `http://localhost:3000`.
    ```bash
    npm start
    ```

2.  **Run the Script**:
    Open a new terminal window in the project root:
    ```bash
    python3 selenium_test.py
    ```

## What the Script Does

1.  **Registers** a new user with a random email.
2.  **Logs in** with the created credentials.
3.  **Verifies** the Home Page elements (`#home-heading`, `#navbar`).
4.  **Searches** for gyms in "Patiala" on the search page.
