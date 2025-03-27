import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../Services/authService';
import { Link } from 'react-router-dom';
import googleIcon from '../../assets/google-logo.png';
import metaMaskIcon from '../../assets/metamask-icon.svg';
import { useMutation } from '@tanstack/react-query';
import { Slide, toast } from 'react-toastify';
// import { useAuth } from "../../Context/AuthContext.jsx";

export default function SignupPage() {
    // const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: ''
    });

    const { mutate, isPending, error } = useMutation({
        mutationFn: signupUser,
        onSuccess: () => {
            toast.success('Successfully Signed Up ', {
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
            navigate("/login"); navigate('/login')
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
            <form onSubmit={handleSubmit} className="card w-96 bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                <input name="userName" onChange={handleChange} type="text" placeholder="Full Name" className="input input-bordered w-full mb-2" />
                <input name="email" onChange={handleChange} type="email" placeholder="Email" className="input input-bordered w-full mb-2" />
                <input name="password" onChange={handleChange} type="password" placeholder="Password" className="input input-bordered w-full mb-4" />
                <button type="submit" className="btn btn-soft btn-primary w-full mb-2" disabled={isPending}>
                    {isPending ? 'Signing Up...' : 'Sign Up'}
                </button>

                <button type="button" className="btn btn-soft btn-secondary w-full mb-2">
                    <img src={googleIcon} className='inline mr-3 w-6' alt="Google" /> Google
                </button>
                <button type="button" className="btn btn-soft btn-accent w-full">
                    <img src={metaMaskIcon} className='inline mr-3 w-6' alt="MetaMask" /> MetaMask
                </button>

                {
                    error &&
                    <div role="alert" className="alert alert-error mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error?.response?.data?.message || 'Signup failed'}</span>
                    </div>
                }



                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-primary">Login</Link>
                </p>
            </form>
        </div>
    );
}
