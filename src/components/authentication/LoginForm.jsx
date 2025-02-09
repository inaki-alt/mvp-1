import React, { useState } from 'react';
import { FiFacebook } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import PropTypes from 'prop-types';

const LoginForm = ({ registerPath, resetPath }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            console.log('Login successful:', data);
            alert('Login successful!');
            navigate('/dashboard'); // Cambia "/dashboard" por la ruta deseada
        } catch (error) {
            console.error('Error logging in:', error.message);
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Login as Non-Profit</h2>
            <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
            <p className="fs-12 fw-medium text-muted">Thank you for getting back</p>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleLogin} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email or Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="rememberMe" />
                            <label className="custom-control-label c-pointer" htmlFor="rememberMe">
                                Remember Me
                            </label>
                        </div>
                    </div>
                    <div>
                        <Link to={resetPath} className="fs-11 text-primary">
                            Forget password?
                        </Link>
                    </div>
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
            <div className="w-100 mt-5 text-center mx-auto">
                <div className="mb-4 border-bottom position-relative">
                    <span className="small py-1 px-3 text-uppercase text-muted bg-white position-absolute translate-middle">
                        or
                    </span>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <a
                        href="#"
                        className="btn btn-light-brand flex-fill"
                        data-bs-toggle="tooltip"
                        data-bs-trigger="hover"
                        title="Login with Facebook"
                    >
                        <FiFacebook size={16} />
                    </a>
                </div>
            </div>
            <div className="mt-5 text-muted">
                <span>Don't have an account?</span>
                <Link to={registerPath} className="fw-bold">
                    {' '}
                    Create an Account
                </Link>
            </div>
        </>
    );
};

// Validación de props
LoginForm.propTypes = {
    registerPath: PropTypes.string.isRequired,
    resetPath: PropTypes.string.isRequired,
};

export default LoginForm;
