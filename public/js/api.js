const API_URL = 'http://localhost:3000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.userId = localStorage.getItem('userId');
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
        if (this.userId) headers['x-user-id'] = this.userId; // Lab-specific header
        return headers;
    }

    async request(endpoint, method = 'GET', body = null) {
        const config = {
            method,
            headers: this.getHeaders(),
        };

        if (body) config.body = JSON.stringify(body);

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();
            return { status: response.status, ...data };
        } catch (error) {
            console.error('API Request Failed:', error);
            return { success: false, message: 'Network connection error. Is the backend running?' };
        }
    }

    // Auth
    async login(email, password) {
        const res = await this.request('/auth/login', 'POST', { email, password });
        if (res.success) {
            this.setSession(res.data);
        }
        return res;
    }

    async register(userData) {
        return this.request('/auth/register', 'POST', userData);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        window.location.href = '/index.html';
    }

    setSession(data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
        localStorage.setItem('name', data.name);
        this.token = data.token;
        this.userId = data.userId;
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    getCurrentUser() {
        return {
            userId: localStorage.getItem('userId'),
            name: localStorage.getItem('name'),
            role: localStorage.getItem('role')
        };
    }

    // Gyms
    async searchGyms(filters = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return this.request(`/gyms?${params.toString()}`);
    }

    async getGym(id) {
        return this.request(`/gyms/${id}`);
    }

    // Trainers
    async searchTrainers(filters = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return this.request(`/trainers?${params}`);
    }

    async getTrainer(id) {
        return this.request(`/trainers/${id}`);
    }
}

const api = new ApiService();
