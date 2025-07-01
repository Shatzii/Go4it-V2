import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle GET requests
export const get = async (url: string) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to handle POST requests
export const post = async (url: string, data: any) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to handle PUT requests
export const put = async (url: string, data: any) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to handle DELETE requests
export const del = async (url: string) => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};