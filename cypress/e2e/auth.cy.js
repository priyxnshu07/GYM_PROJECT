describe('User Authentication', () => {
    beforeEach(() => {
        // Reset or clear state if possible (not needed for simple flows on persistent local DB unless we add reset endpoint)
        // For lab, we assume clean state or unique emails
    });

    it('TC_AUTH_001: Should register a new user successfully', () => {
        const timestamp = Date.now();
        const email = `testuser${timestamp}@example.com`;

        cy.visit('/pages/auth/register.html');
        cy.get('#name').type('Test User');
        cy.get('#email').type(email);
        cy.get('#password').type('password123');
        cy.get('#phone').type('1234567890');
        cy.get('#role').select('user');
        cy.get('#city').type('New York');

        cy.get('button[type="submit"]').click();

        // Check for success alert (stubbing alert)
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Registration successful! Please login.');
        });

        // Should be redirected to login
        cy.url().should('include', '/login.html');
    });

    it('TC_AUTH_006: Should login successfully with valid credentials', () => {
        // Register first to ensure user exists
        const timestamp = Date.now();
        const email = `loginuser${timestamp}@example.com`;
        const password = 'password123';

        cy.request('POST', '/api/auth/register', {
            name: 'Login User',
            email: email,
            password: password,
            phone: '1234567890',
            role: 'user'
        });

        cy.visit('/pages/auth/login.html');
        cy.get('#email').type(email);
        cy.get('#password').type(password);
        cy.get('button[type="submit"]').click();

        // Verify redirect to dashboard
        cy.url().should('include', '/user/dashboard.html');

        // Verify local storage
        cy.window().should((window) => {
            expect(window.localStorage.getItem('token')).to.be.a('string');
            expect(window.localStorage.getItem('role')).to.equal('user');
        });
    });

    it('TC_AUTH_007: Should fail login with invalid password', () => {
        const timestamp = Date.now();
        const email = `failuser${timestamp}@example.com`;
        const password = 'password123';

        cy.request('POST', '/api/auth/register', {
            name: 'Fail User',
            email: email,
            password: password,
            phone: '1234567890',
            role: 'user'
        });

        cy.visit('/pages/auth/login.html');
        cy.get('#email').type(email);
        cy.get('#password').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        cy.get('#error-msg').should('contain', 'Invalid credentials');
        cy.url().should('include', '/login.html');
    });
});
