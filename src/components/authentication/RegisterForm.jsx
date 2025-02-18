import React, { useState } from 'react'
import { FiEye, FiHash } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js'

const RegisterForm = ({path}) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        username: username,
                    },
                },
            });

            if (error) throw error;

            console.log('Registration successful:', data);
            alert('Registration successful! Check your email for confirmation.');
        } catch (err) {
            console.error('Registration error:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Register</h2>
            <h4 className="fs-13 fw-bold mb-2">Manage all your Non-Profit Events here</h4>
            <p className="fs-12 fw-medium text-muted">Let's get you all setup, so you can verify your personal
                account and begine setting up your profile.</p>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleRegister} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input type="text" className="form-control" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <input type="tel" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-4 generate-pass">
                    <div className="input-group field">
                        <input type="password" className="form-control password" id="newPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <div className="input-group-text c-pointer gen-pass" data-bs-toggle="tooltip" title="Generate Password"><FiHash size={16}/></div>
                        <div className="input-group-text border-start bg-gray-2 c-pointer" data-bs-toggle="tooltip" title="Show/Hide Password"><FiEye size={16}/></div>
                    </div>
                    <div className="progress-bar mt-2">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
                <div className="mb-4">
                    <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <div className="mt-4">
                    <div className="custom-control custom-checkbox mb-2">
                        <input type="checkbox" className="custom-control-input" id="receiveMial" required />
                        <label className="custom-control-label c-pointer text-muted" htmlFor="receiveMial" style={{ fontWeight: '400 !important' }}>Yes, I wnat to receive Altruence community
                            emails</label>
                    </div>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="termsCondition" required />
                        <label className="custom-control-label c-pointer text-muted" htmlFor="termsCondition" style={{ fontWeight: '400 !important' }}>I agree to all the <a href="#">Terms &amp;
                            Conditions</a> and <a href="#">Fees</a>.</label>
                    </div>
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
            </form>
            <div className="mt-5 text-muted">
                <span>Already have an account?</span>
                <Link to={path} className="fw-bold"> Login</Link>
            </div>
        </>
    )
}

export default RegisterForm