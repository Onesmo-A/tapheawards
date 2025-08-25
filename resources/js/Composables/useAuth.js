import { ref, computed } from 'vue';
import axios from 'axios';
import { router } from '@inertiajs/vue3';

// Hifadhi ya state ya uthibitishaji
const user = ref(JSON.parse(localStorage.getItem('user')) || null);
const token = ref(localStorage.getItem('token') || null);

// Weka token kwenye axios headers ikiwa ipo
if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
}

export function useAuth() {

    const isAuthenticated = computed(() => !!token.value);

    /**
     * Weka data ya mtumiaji na token baada ya login/register kufanikiwa.
     */
    const setAuthData = (userData, userToken) => {
        user.value = userData;
        token.value = userToken;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    };

    /**
     * Futa data ya mtumiaji na token baada ya logout.
     */
    const clearAuthData = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    /**
     * Jaribu kuingia (login).
     */
    const login = async (credentials) => {
        // Futa CSRF cookie kwanza ili kupata mpya
        await axios.get('/sanctum/csrf-cookie');
        const response = await axios.post('/api/login', credentials);
        setAuthData(response.data.user, response.data.token);
    };

    /**
     * Jaribu kujisajili (register).
     */
    const register = async (data) => {
        await axios.get('/sanctum/csrf-cookie');
        const response = await axios.post('/api/register', data);
        setAuthData(response.data.user, response.data.token);
    };

    /**
     * Jaribu kutoka (logout).
     */
    const logout = async () => {
        if (isAuthenticated.value) {
            try {
                await axios.post('/api/logout');
            } catch (error) {
                console.error("Logout failed, but clearing client-side session anyway.", error);
            } finally {
                clearAuthData();
                router.visit('/'); // Rudisha mtumiaji kwenye ukurasa wa mwanzo
            }
        }
    };

    return { user, token, login, register, logout, isAuthenticated };
}

