# Contributing to Gym Project

We welcome contributions! Please follow these guidelines to ensure a smooth collaboration process.

## Git Workflow

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Create a new branch**:
   Always work on a new branch for each feature or bug fix.
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**:
   Write clean, readable code.

4. **Commit your changes**:
   Write meaningful commit messages.
   ```bash
   git add .
   git commit -m "feat: add user login functionality"
   ```

5. **Push to GitHub**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request (PR)**:
   - Go to the repository on GitHub.
   - You should see a prompt to create a PR from your branch.
   - Describe your changes and request a review from a teammate.

## Code Style

- Follow standard JavaScript/Node.js conventions.
- Ensure your code doesn't break existing functionality.

## Tests

- If you add a new feature, consider adding a relevant test case in Cypress if applicable.
- Run existing tests before pushing to ensure no regressions.
