import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LoginMinimal = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });

            if (error) throw error;

            const { data: userData, error: userError } = await supabase
                .from('Users')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (userError) throw userError;

            // Conditional navigation based on user role
            if (userData.is_volunteer) {
                navigate('/volunteer/home'); // Navigate to volunteer home dashboard
            } else {
                navigate('/'); // Navigate to the default home/dashboard
            }
            
        } catch (error) {
            console.error('Error during sign in:', error);
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
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
                            <h2 className="fs-20 fw-bolder mb-4">Sign In</h2>
                            <h4 className="fs-13 fw-bold mb-2">Welcome back!</h4>
                            <p className="fs-12 fw-medium text-muted">
                                Sign in to continue to your account
                            </p>
                            {error && <p className="text-danger">{error}</p>}
                            
                            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Email Address"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-lg btn-primary w-100"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </div>
                            </form>
                            
                            <div className="mt-5">
                                <p className="text-center mb-4">Don't have an account?</p>
                                <button 
                                    onClick={() => navigate('/nonprofit-signup')}
                                    className="btn btn-lg btn-outline-primary w-100"
                                >
                                    Sign up as Non-Profit
                                </button>
                                <button 
                                    onClick={() => navigate('/volunteer-signup')}
                                    className="btn btn-lg btn-outline-primary w-100 mt-3"
                                >
                                    Sign up as Volunteer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginMinimal;