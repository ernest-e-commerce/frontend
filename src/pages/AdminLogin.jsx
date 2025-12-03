// src/pages/AdminLogin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Placeholder for an actual login function
const authenticateAdmin = (username, password) => {
  // In a real app, this would be an API call
  return username === 'admin' && password === 'password123'; 
};

const AdminLogin = ({ setIsAdminLoggedIn }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (authenticateAdmin(username, password)) {
      // Set the state in the parent (e.g., App.jsx) to indicate login
      // For this example, we'll just navigate away and assume success
      // In a real app, this would involve tokens/context state.
      // We will simulate the login success:
      localStorage.setItem('adminToken', 'fake-admin-token'); 
      navigate('/admin'); // Redirect to the dashboard
      // Optionally, set the state prop if you pass it down
      if (setIsAdminLoggedIn) setIsAdminLoggedIn(true);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;