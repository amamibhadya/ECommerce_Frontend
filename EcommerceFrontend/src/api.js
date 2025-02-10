import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5132',
});

export default api;
