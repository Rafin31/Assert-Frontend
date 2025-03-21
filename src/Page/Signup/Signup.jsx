import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import googleIcon from '.././../assets/google-logo.png';
import metaMaskIcon from '.././../assets/metamask-icon.svg';

export default function SignupPage() {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Signup Data:", formData);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className="input input-bordered w-full mb-2"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="input input-bordered w-full mb-2"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="input input-bordered w-full mb-4"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn btn-soft btn-primary w-full mb-2">Sign Up</button>
                </form>
                <button className=" btn btn-soft btn-secondary w-full mb-2">
                    <img src={googleIcon} className='inline mr-3 w-6' alt="icon" />
                    Google
                </button>
                <button className="btn btn-soft btn-accent w-full">
                    <img src={metaMaskIcon} className='inline mr-3 w-6' alt="icon" />
                    MetaMask
                </button>
                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-primary">Login</Link>
                </p>
            </div>
        </div>
    );
}
