import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // Demo credentials
  const demoUsers = [
    { email: 'admin@company.com', password: 'admin123', name: 'Admin User', role: 'admin' },
    { email: 'john.doe@company.com', password: 'password123', name: 'John Doe', role: 'manager' },
    { email: 'jane.smith@company.com', password: 'password123', name: 'Jane Smith', role: 'employee' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Login attempt with:', credentials);
    
    // Simulate API call delay
    setTimeout(() => {
      const user = demoUsers.find(
        user => user.email === credentials.email && user.password === credentials.password
      );
      
      console.log('Found user:', user);
      
      if (user) {
        // Use the login function from AuthContext
        login({
          name: user.name,
          email: user.email,
          role: user.role
        });
        
        // Redirect to dashboard
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
      
      setLoading(false);
    }, 800);
  };

  const handleDemoLogin = (email, password) => {
    setCredentials({ email, password });
    setLoading(true);
    setError('');
    
    // Find the user with these credentials
    const user = demoUsers.find(
      user => user.email === email && user.password === password
    );
    
    if (user) {
      // Use the login function from AuthContext
      login({
        name: user.name,
        email: user.email,
        role: user.role
      });
      
      // Redirect to dashboard
      navigate('/');
    } else {
      setError('Demo login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Employee Management System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
              {error}
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <div className="font-medium text-gray-900">Demo Accounts:</div>
            <ul className="mt-2 text-gray-600">
              <li>
                <button 
                  type="button"
                  className="text-indigo-600 hover:text-indigo-500 hover:underline"
                  onClick={() => handleDemoLogin('admin@company.com', 'admin123')}
                >
                  Admin: admin@company.com / admin123
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className="text-indigo-600 hover:text-indigo-500 hover:underline"
                  onClick={() => handleDemoLogin('john.doe@company.com', 'password123')}
                >
                  Manager: john.doe@company.com / password123
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className="text-indigo-600 hover:text-indigo-500 hover:underline"
                  onClick={() => handleDemoLogin('jane.smith@company.com', 'password123')}
                >
                  Employee: jane.smith@company.com / password123
                </button>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 