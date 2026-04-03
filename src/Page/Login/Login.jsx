import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../Services/authService';
import { useAuth } from "../../Context/AuthContext.jsx";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const { mutate, isPending, error } = useMutation({
        mutationFn: loginUser,
        onSuccess: (response) => {
            toast.success('Welcome back!', { position: "top-center", autoClose: 2000, theme: "light", transition: Slide });
            login(response.token, response.user);
            navigate('/');
        },
        onError: (err) => {
            console.error('Login Error:', err);
        }
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); mutate(formData); };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--assert-bg)' }}>
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2.5 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-violet-200">
                            <span className="text-white font-black text-base">A</span>
                        </div>
                        <span className="font-black text-2xl tracking-tight gradient-text">ASSERT</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back</h1>
                    <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
                </div>

                <div className="assert-card p-7">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="form-label">Email address</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="assert-input pl-9 w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Password</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="assert-input pl-9 w-full"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error?.response?.data?.message || 'Login failed. Please try again.'}
                            </div>
                        )}

                        <button type="submit" className="btn-assert w-full justify-center py-2.5 mt-1" disabled={isPending}>
                            {isPending ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-5">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-violet-600 font-semibold hover:text-violet-700">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
