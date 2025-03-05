import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const VolunteerSignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        is_volunteer: true
                    }
                }
            });

            if (signUpError) throw signUpError;
            if (!authData.user) throw new Error('No user data returned after signup');

            // 2. Insert into Users table
            const { error: userError } = await supabase.from('Users')
                .insert({
                    id: authData.user.id,
                    email: formData.email,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    phone_number: formData.phone,
                    is_volunteer: true, // Indicate that this user is a volunteer
                    password_hash: 'handled_by_supabase_auth'
                });

            if (userError) throw userError;

            alert('Sign-up successful! Please check your email to confirm your account.');
            navigate('/signin');

        } catch (err) {
            console.error('Error during sign-up:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-minimal-wrapper">
            <div className="auth-minimal-inner">
                <div className="minimal-card-wrapper">
                    <div className="card mb-4 mt-5 mx-4 mx-sm-0 position-relative">
                        <div className="wd-50 bg-white p-2 rounded-circle shadow-lg position-absolute translate-middle top-0 start-50">
                            <img src="/images/logo-abbr.png" alt="img" className="img-fluid" />
                        </div>
                        <div className="card-body p-sm-5">
                            <h2 className="fs-20 fw-bolder mb-4">Register as Volunteer</h2>
                            <h4 className="fs-13 fw-bold mb-2">Create your Volunteer Account</h4>
                            <p className="fs-12 fw-medium text-muted">
                                Let's get you set up to start volunteering
                            </p>
                            {error && <p className="text-danger">{error}</p>}
                            
                            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="form-control"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="form-control"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-control"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            className="form-control"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="input-group-text border-start bg-gray-2 c-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <button
                                        type="submit"
                                        className="btn btn-lg btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Create Volunteer Account'}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-5 text-muted">
                                <span>Already have an account?</span>
                                <Link to="/signin" className="fw-bold"> Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VolunteerSignUp; 