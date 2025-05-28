import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://mavexa.autsync.info/admin';
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY = 1; // 1 day in days

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });
    
    if (response.data.access_token) {
      // Store token in cookie with 24 hour expiry
      Cookies.set(TOKEN_KEY, response.data.access_token, { expires: TOKEN_EXPIRY });
      
      // Store user data in localStorage for user info
      const userData = {
        username,
        token: response.data.access_token,
        tokenType: response.data.token_type
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Set auth token for all axios requests
export const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

