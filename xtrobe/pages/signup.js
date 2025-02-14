import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SignUp = () => {
    const router = useRouter();
    const [details, setDetails] = useState({
        Name: '',
        Phoneno: '',
        Email: '',
        Password: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Name' && /\s/.test(value)) return;
        if (name === 'Phoneno' && !/^\d{0,10}$/.test(value)) return;
        setDetails({ ...details, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!details.Name || !details.Phoneno || !details.Email || !details.Password) {
            setErrorMessage('Please fill in all fields correctly.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setSuccessMessage('SignUp was successful!');
            setLoading(false);
            setTimeout(() => router.push('/login'), 2000);
        }, 2000);
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-black" style={{ backgroundImage: "url('/space-background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <button onClick={() => router.push('/login')} className="absolute top-4 right-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-gray-800 focus:outline-none transition duration-300">
                Login
            </button>

            {/* Success Message Modal */}
            {successMessage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center w-3/4 md:w-1/2">
                        <h2 className="text-3xl font-semibold">Success</h2>
                        <p className="mt-4 text-lg">{successMessage}</p>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md p-6 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-white">Sign Up</h2>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label className="block text-white">Name</label>
                        <input name='Name' value={details.Name} className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none" placeholder="Enter your Name" onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white">Phone Number</label>
                        <input name='Phoneno' type="text" value={details.Phoneno} className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none" placeholder="Enter your Phone Number" onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white">Email</label>
                        <input name='Email' type="email" value={details.Email} className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none" placeholder="Enter your Email" onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white">Password</label>
                        <input
                            name='Password'
                            type="password"
                            value={details.Password}
                            className="w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
                            placeholder="Enter your Password"
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none transition duration-300">
                        {loading ? 'Signing Up...' : 'Sign Up'}
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

export default SignUp;
