// API service for connecting to backend
const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  // Auth endpoints
  register: (userData) => 
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).then(res => res.json()),

  login: (credentials) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then(res => res.json()),

  // Book endpoints
  getBooks: () => 
    fetch(`${API_BASE_URL}/books`).then(res => res.json()),

  getBook: (id) => 
    fetch(`${API_BASE_URL}/books/${id}`).then(res => res.json()),

  // Library endpoints
  getLibrary: (token) => 
    fetch(`${API_BASE_URL}/library`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(res => res.json()),

  // Payment endpoints
  initiatePayment: (bookId, token) => 
    fetch(`${API_BASE_URL}/payment/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId }),
    }).then(res => res.json()),

  // Reading progress endpoints
  getProgress: (bookId, token) => 
    fetch(`${API_BASE_URL}/progress/${bookId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then(res => res.json()),

  updateProgress: (bookId, progress, token) => 
    fetch(`${API_BASE_URL}/progress/${bookId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ progress }),
    }).then(res => res.json()),
};