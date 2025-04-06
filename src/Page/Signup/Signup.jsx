import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../Services/authService';
import { Link } from 'react-router-dom';
// import googleIcon from '../../assets/google-logo.png';
// import metaMaskIcon from '../../assets/metamask-icon.svg';
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
            toast.success(err.response?.data.error.split(":")[2], {
                position: "top-center",
                autoClose: 2000,
            });
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


                {/* <input name="userName" onChange={handleChange} type="text" placeholder="Full Name" className="input input-bordered w-full mb-2" /> */}

                <label className="input w-full">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></g></svg>
                    <input type="input" required placeholder="Username"
                        title="Only letters, numbers or dash"
                        name="userName"
                        onChange={handleChange}
                    />
                </label>


                <label className="input w-full my-3">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                    <input type="email" placeholder="email@site.com" required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>


                <label className="input validator w-full">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                    <input type="password" required placeholder="Password" minLength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                        className="w-full"
                    />
                </label>
                <p className="validator-hint hidden">
                    Must be more than 8 characters, including
                    <br />At least one number
                    <br />At least one lowercase letter
                    <br />At least one uppercase letter
                </p>




                <button type="submit" className="btn btn-success w-full my-2" disabled={isPending}>
                    {isPending ? 'Signing Up...' : 'Sign Up'}
                </button>

                {/* <button className="btn w-full mb-2 btn-disabled">
                    <img src={googleIcon} className='inline mr-3 w-6' alt="icon" />
                    Google
                </button>
                <button className="btn w-full btn-disabled">
                    <img src={metaMaskIcon} className='inline mr-3 w-6' alt="icon" />
                    MetaMask
                </button> */}

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
                    Already have an account? <Link to="/login" className="link link-error">Login</Link>
                </p>
            </form>
        </div>
    );
}
