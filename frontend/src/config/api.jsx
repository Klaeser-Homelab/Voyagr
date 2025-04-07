const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const api = {
  baseUrl: API_BASE_URL,
  endpoints: {
    todos: `${API_BASE_URL}/api/todos`,
    habits: `${API_BASE_URL}/api/habits`,
    values: `${API_BASE_URL}/api/values`,
    events: `${API_BASE_URL}/api/events`,
    auth: `${API_BASE_URL}/auth`,
    users: `${API_BASE_URL}/api/users`
  }
}; 