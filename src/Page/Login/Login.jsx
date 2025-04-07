import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import googleIcon from '.././../assets/google-logo.png';
// import metaMaskIcon from '.././../assets/metamask-icon.svg';
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
                <h2 className="text-2xl font-bold mb-4 text-center">Logasdasdsadin---</h2>
                <form onSubmit={handleSubmit}>

                    <label className="input w-full">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                        <input type="email" placeholder="email@site.com" required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>


                    <label className="input my-3 w-full">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                        <input type="password" required placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                            className="w-full"
                        />
                    </label>

                    <button type="submit" className="btn btn-success w-full mb-2" disabled={isPending}>
                        {isPending ? 'Logging In...' : 'Login'}
                    </button>
                </form>
                {/* <button className="btn w-full mb-2">
                    <img src={googleIcon} className='inline mr-3 w-6' alt="icon" />
                    Google
                </button>
                <button className="btn w-full">
                    <img src={metaMaskIcon} className='inline mr-3 w-6' alt="icon" />
                    MetaMask
                </button> */}

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