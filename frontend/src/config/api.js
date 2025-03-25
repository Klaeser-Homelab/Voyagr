const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export const api = {
  baseUrl: API_BASE_URL,
  endpoints: {
    todos: `${API_BASE_URL}/api/todos`,
    inputs: `${API_BASE_URL}/api/inputs`,
    values: `${API_BASE_URL}/api/values`,
    events: `${API_BASE_URL}/api/events`,
    auth: `${API_BASE_URL}/auth`
  }
}; 