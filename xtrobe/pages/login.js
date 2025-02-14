import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [loginDetails, setLoginDetails] = useState({
    PhoneNumber: '',
    UserPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); 

    setMessage('');

    const { PhoneNumber, UserPassword } = loginDetails;
    try {
      const res = await fetch(`https://xtrobe-92650-default-rtdb.firebaseio.com/UserData/credentials.json`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const matches = Object.values(data).filter(entry => {
            return entry.Phoneno === PhoneNumber && entry.Password === UserPassword;
          });
          if (matches.length > 0) {
            const user = matches[0].Username;
            localStorage.setItem('token', 'your_token_here');
            setSuccessMessage('Successfully logged in');
            setLoginDetails({
              PhoneNumber: '',
              UserPassword: '',
            });
            setTimeout(() => {
              router.push(`/latestnews`);
            }, 2000);
          } else {
            setErrorMessage('Incorrect phone number or password');
          }
        }
      } else {
        throw new Error('Failed to fetch data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    router.push('/signup');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black" style={{ backgroundImage: "url('/space-background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <button onClick={goToSignUp} className="absolute top-4 right-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-gray-800 focus:outline-none transition duration-300">
        Sign Up
      </button>

      {/* Success Message Modal */}
      {successMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className=" text-white p-6 rounded-lg shadow-lg text-center w-1/4 md:w-1/2">
            <h2 className="text-3xl font-semibold">Success</h2>
            <p className="mt-4 text-lg">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md p-6 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white">Login</h2>
        <form onSubmit={handleLoginSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-white">Phone Number</label>
            <input
              type="text"
              name="PhoneNumber"
              value={loginDetails.PhoneNumber}
              onChange={handleLoginChange}
              className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
              placeholder="Enter your Phone Number"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Password</label>
            <input
              type="password"
              name="UserPassword"
              value={loginDetails.UserPassword}
              onChange={handleLoginChange}
              className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
              placeholder="Enter your Password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none transition duration-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {errorMessage && (
    <div className="mt-4 flex justify-center">
        <p className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md animate-fade">
            {errorMessage}
        </p>
    </div>
)}

        </form>
      </div>
    </div>
  );
};

export default Login;
