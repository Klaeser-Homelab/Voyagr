const BASE_URL = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3001';

export const api = {
  baseUrl: BASE_URL,
  endpoints: {
    todos: `${BASE_URL}/api/todos`,
    habits: `${BASE_URL}/api/habits`,
    values: `${BASE_URL}/api/values`,
    events: `${BASE_URL}/api/events`,
    auth: `${BASE_URL}/auth`,
    users: `${BASE_URL}/api/users`
  }
};