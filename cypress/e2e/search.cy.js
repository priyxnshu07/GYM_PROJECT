describe('Search Functionality', () => {
    // Seed data
    before(() => {
        // Register Gym Owner
        const timestamp = Date.now();
        const ownerEmail = `search_owner${timestamp}@test.com`;

        cy.request('POST', '/api/auth/register', {
            name: 'Search Owner',
            email: ownerEmail,
            passsword: 'password',
            role: 'gymOwner',
            phone: '0000000000'
        }).then((res) => {
            const token = res.body.data.token;
            // Create Gym
            cy.request({
                method: 'POST',
                url: '/api/gyms',
                headers: { 'Authorization': `Bearer ${token}`, 'x-user-id': res.body.data.userId },
                body: {
                    name: 'Search Test Gym',
                    address: { city: 'New York', state: 'NY', street: '123 St' },
                    phone: '123',
                    facilities: ['cardio_machines']
                }
            });
        });

        // Register Trainer
        const trainerEmail = `search_trainer${timestamp}@test.com`;
        cy.request('POST', '/api/auth/register', {
            name: 'Search Trainer',
            email: trainerEmail,
            password: 'password',
            role: 'trainer'
        }).then((res) => {
            const token = res.body.data.token;
            // Create Profile
            cy.request({
                method: 'POST',
                url: '/api/trainers/profile',
                headers: { 'Authorization': `Bearer ${token}`, 'x-user-id': res.body.data.userId },
                body: {
                    specializations: ['weight_training'],
                    hourlyRate: 50,
                    bio: 'Test Bio'
                }
            });
        });
    });

    it('TC_SEARCH_003: Should search gyms by city', () => {
        cy.visit('/pages/public/search-gyms.html');
        cy.get('#city').type('New York');
        cy.get('button[type="submit"]').click();

        cy.get('.card').should('contain', 'Search Test Gym');
        cy.get('.card').should('contain', 'New York');
    });

    it('TC_SEARCH_002: Should search trainers by specialization', () => {
        cy.visit('/pages/public/search-trainers.html');
        cy.get('#specialization').type('weight_training');
        cy.get('button[type="submit"]').click();

        cy.get('.card').should('contain', 'Search Trainer');
        cy.get('.card').should('contain', 'weight_training');
    });
});
