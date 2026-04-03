import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../../Services/authService';
import { useMutation } from '@tanstack/react-query';
import { Slide, toast } from 'react-toastify';

export default function SignupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ userName: '', email: '', password: '' });

    const { mutate, isPending, error } = useMutation({
        mutationFn: signupUser,
        onSuccess: () => {
            toast.success('Account created! Please log in.', { position: "top-center", autoClose: 2000, theme: "light", transition: Slide });
            navigate('/login');
        },
        onError: () => {
            toast.error("Signup failed", { position: "top-center", autoClose: 2000, theme: "light" });
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
                    <h1 className="text-2xl font-black text-slate-900 mb-1">Create an account</h1>
                    <p className="text-slate-500 text-sm">Join the prediction platform and start earning</p>
                </div>

                <div className="assert-card p-7">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="form-label">Username</label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input
                                    type="text"
                                    name="userName"
                                    required
                                    placeholder="your_username"
                                    onChange={handleChange}
                                    className="assert-input pl-9 w-full"
                                />
                            </div>
                        </div>

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
                                    minLength="8"
                                    pattern={"(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}"}
                                    title="Must include uppercase, lowercase, number, special character & 8+ characters."
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="assert-input pl-9 w-full"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5">8+ chars · uppercase · lowercase · number · special character</p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error.response?.data?.error
                                    ? error.response.data.error.split("password:")[1]
                                    : error.response?.data?.message || "Signup failed"}
                            </div>
                        )}

                        <button type="submit" className="btn-assert w-full justify-center py-2.5 mt-1" disabled={isPending}>
                            {isPending ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-5">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
