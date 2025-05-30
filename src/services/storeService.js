import axios from 'axios';
import { getToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'https://mavexa.autsync.info/admin';

export const getStores = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/stores`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

export const getTokenUsage = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/token-usage`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching token usage:', error);
    throw error;
  }
};

export const getChatHistory = async (storeId = null, limit = 10, offset = 0) => {
  try {
    const token = getToken();
    let url = `${API_URL}/chat-history?limit=${limit}&offset=${offset}`;

    if (storeId) {
      url += `&store_id=${storeId}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};
