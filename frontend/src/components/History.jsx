import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../config/api';

const History = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const response = await axios.get(`${api.endpoints.todos}/completed`);
        setTodos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching completed todos:', error);
        setError('Failed to fetch completed todos');
        setLoading(false);
      }
    };

    fetchCompletedTodos();
  }, []);

 

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Completed Tasks History</h1>
      <div className="grid gap-4">
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <div 
              key={todo.DOID} 
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {todo.Value?.Name || todo.Input?.Value?.Name || 'Unknown Value'}
                  </h3>
                  <p className="text-gray-600">
                    {todo.Input?.Name || 'No specific input'}
                  </p>
                  <p className="text-gray-700 mt-2">
                    {todo.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </p>
                  {todo.Event && (
                    <p className="text-sm font-medium">
                      Duration: {todo.Event.duration} minutes
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No completed tasks found
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 