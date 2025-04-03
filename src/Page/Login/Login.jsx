import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import googleIcon from '.././../assets/google-logo.png';
import metaMaskIcon from '.././../assets/metamask-icon.svg';
import { Slide, toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../Services/authService';
import { useAuth } from "../../Context/AuthContext.jsx";

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth();

    const [formData, setFormData] = useState(
        {
            email: '',
            password: ''
        }
    );

    const { mutate, isPending, error } = useMutation({
        mutationFn: loginUser,
        onSuccess: (response) => {
            toast.success('Logged In', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide,
            });
            login(response.token, response.user);

            navigate('/')
        },
        onError: (err) => {
            console.error('Signup Error:', err);
        }
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(formData);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-error w-full mb-2" disabled={isPending}>
                        {isPending ? 'Logging In...' : 'Login'}
                    </button>
                </form>
                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-lg w-full mb-2">
                    <img src={googleIcon} className='inline mr-3 w-6' alt="icon" />
                    Google
                </button>
                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-lg w-full">
                    <img src={metaMaskIcon} className='inline mr-3 w-6' alt="icon" />
                    MetaMask
                </button>

                {
                    error &&
                    // <p className="text-red-500 mt-5 text-sm text-center">{error?.response?.data?.message || 'Login failed'}</p>
                    <div role="alert" className="alert alert-error mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error?.response?.data?.message || 'Login failed'}</span>
                    </div>
                }



                <p className="mt-4 text-center">
                    Don't have an account? <Link to="/signup" className="link link-error">Sign up</Link>
                </p>
            </div>
        </div>
    );
}