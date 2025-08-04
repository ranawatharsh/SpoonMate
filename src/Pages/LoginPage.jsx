import React, { useState } from 'react';

// ... (Icon and AuthInput components remain the same)
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const AuthInput = ({ id, type, placeholder, icon, value, onChange }) => ( <div className="relative mb-4"> <span className="absolute inset-y-0 left-0 flex items-center pl-3">{icon}</span> <input type={type} id={id} name={id} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent outline-none transition" placeholder={placeholder} value={value} onChange={onChange} required /> </div> );

const LoginPage = ({ onSignUpClick, onLoginSuccess }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://spoonmate.onrender.com/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to log in');
            
            // Pass the complete user data (including token) to the parent
            onLoginSuccess(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4">
            <img src="/SpoonM.jpg" alt="SpoonMate Logo" className="h-20 mb-8" />
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-[#4A4A4A] mb-2">Welcome Back!</h2>
                <form onSubmit={handleLogin}>
                    <AuthInput id="email" type="email" placeholder="Email Address" icon={<MailIcon />} value={formData.email} onChange={handleChange}/>
                    <AuthInput id="password" type="password" placeholder="Password" icon={<LockIcon />} value={formData.password} onChange={handleChange}/>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-[#FF6B6B] text-white font-bold py-3 px-4 rounded-lg mt-4 hover:opacity-90 transition-opacity disabled:bg-gray-400">
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                <p className="text-center text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <button onClick={onSignUpClick} className="font-semibold text-[#FF6B6B] hover:underline">Sign Up</button>
                </p>
            </div>
        </div>
    );
};
export default LoginPage;