import axios from '@/lib/api/client';

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  // You can add logout API call here if needed
  return Promise.resolve();
};
