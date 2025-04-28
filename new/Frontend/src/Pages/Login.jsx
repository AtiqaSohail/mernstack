import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useFormik } from 'formik';
import userLoginValidationSchema from '../Validation/userLoginValidationSchema';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../assets/css/style.css';
import { login } from '../store/authSlice.mjs';
import { useDispatch } from 'react-redux';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetPassword, setResetPassword] = useState('');
    const [resetId, setResetId] = useState('');
    const [resetToken, setResetToken] = useState('');

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        const token = params.get('token');
        if (id && token) {
            setResetId(id);
            setResetToken(token);
            setShowResetPassword(true);
        }
    }, [location]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: userLoginValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            console.log("Form submitted with values:", values);
        
            try {
                console.log('Sending login request to:', `${apiUrl}/login`);
                const response = await axios.post(`${apiUrl}/login`, {
                    email: values.email,
                    password: values.password
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });
        
                console.log('Login response:', response.data);
                setLoading(false);
        
                if (response.status >= 200 && response.status < 300) {
                    localStorage.setItem("token", response.data.token)
                    localStorage.setItem("userID", response.data._id)
                    dispatch(login({
                        token: response.data.token,
                        userID: response.data._id
                    }));
                    Swal.fire({
                        title: 'Success!',
                        text: 'You have logged in successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/create-task');
                    });
                }
            } catch (error) {
                console.error('Login error:', error?.response?.data || error.message);
                setLoading(false);
                Swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.message || 'Invalid email or password. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },
    });        


const handleForgotPassword = async () => {
        if (!forgotPasswordEmail) {
            Swal.fire({
                title: 'Error!',
                text: 'Please enter your email address',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${apiUrl}/forget`, {
                email: forgotPasswordEmail
            });

            setLoading(false);
            if (response.status >= 200 && response.status < 300) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Password reset link has been sent to your email!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setShowForgotPassword(false);
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to send reset link',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg,rgb(30, 31, 33) 0%,rgb(46, 77, 218) 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px"
        }}>
            <form 
                onSubmit={formik.handleSubmit} 
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    padding: "40px 30px",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    maxWidth: "420px",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "30px", color: "#333", marginBottom: "8px" }}>Hello, Welcome!</h2>
                    <p style={{ color: "#777", marginBottom: "12px" }}>Don't have an account?</p>
                    <Link 
                        to="/" 
                        style={{ color: "blue", textDecoration: "none", fontWeight: "800" }}
                    >
                        Sign up here
                    </Link>
                </div>
        
                <div>
                    {!showForgotPassword && !showResetPassword && (
                        <h1 style={{ fontSize: "30px", color: "#444", marginBottom: "20px", textAlign: "center" }}>
                            <b>Login</b> 
                        </h1>
                    )}
        
                    {showForgotPassword ? (
                        <div>
                            <h3 style={{ fontSize: "20px", color: "#333", marginBottom: "10px" }}>Reset Password</h3>
                            <p style={{ color: "#777", marginBottom: "20px" }}>
                                Enter your email to receive a reset link
                            </p>
        
                            <div style={{ position: "relative", marginBottom: "20px" }}>
                                <FaEnvelope style={{ position: "absolute", top: "12px", left: "12px", color: "#aaa" }} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 10px 10px 40px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        outline: "none"
                                    }}
                                />
                            </div>
        
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    backgroundColor: "blue",
                                    color: "#fff",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontWeight: "600",
                                    marginBottom: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
        
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(false)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "transparent",
                                    color: "#6C63FF",
                                    border: "none",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : showResetPassword ? (
                        <div>
                            <h3 style={{ fontSize: "20px", color: "#333", marginBottom: "10px" }}>Set New Password</h3>
                            <p style={{ color: "#777", marginBottom: "20px" }}>
                                Enter your new password below
                            </p>
        
                            <div style={{ position: "relative", marginBottom: "20px" }}>
                                <FaLock style={{ position: "absolute", top: "12px", left: "12px", color: "#aaa" }} />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 10px 10px 40px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        outline: "none"
                                    }}
                                />
                            </div>
        
                            <button
                                type="button"
                                onClick={async () => { /* Reset logic here */ }}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#6C63FF",
                                    color: "#fff",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontWeight: "600",
                                    marginBottom: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
        
                            <button
                                type="button"
                                onClick={() => setShowResetPassword(false)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "transparent",
                                    color: "#6C63FF",
                                    border: "none",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ position: "relative", marginBottom: "20px" }}>
                                <FaEnvelope style={{ position: "absolute", top: "12px", left: "12px", color: "#aaa" }} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    {...formik.getFieldProps('email')}
                                    style={{
                                        width: "100%",
                                        padding: "10px 10px 10px 40px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        outline: "none"
                                    }}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                                        {formik.errors.email}
                                    </div>
                                )}
                            </div>
        
                            <div style={{ position: "relative", marginBottom: "20px" }}>
                                <FaLock style={{ position: "absolute", top: "12px", left: "12px", color: "#aaa" }} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    {...formik.getFieldProps('password')}
                                    style={{
                                        width: "100%",
                                        padding: "10px 10px 10px 40px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        outline: "none"
                                    }}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                                        {formik.errors.password}
                                    </div>
                                )}
                            </div>
        
                            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "blue",
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Forgot Password?
                                </button>
                            </div>
        
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    background: 'linear-gradient(135deg,rgb(17, 18, 19),rgb(82, 90, 162))',
                                    color: "#fff",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontWeight: "600",
                                    marginBottom: "20px",
                                    cursor: "pointer"
                                }}
                            >
                                {loading ? 'Logging In...' : 'Login'}
                            </button>
        
                            <div style={{ textAlign: "center", marginBottom: "20px", color: "#aaa" }}>
                                or login with
                            </div>
        
                            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                                <button style={{ backgroundColor: "#DB4437", color: "#fff", borderRadius: "50%", padding: "10px", border: "none" }}>
                                    <FaGoogle />
                                </button>
                                <button style={{ backgroundColor: "#4267B2", color: "#fff", borderRadius: "50%", padding: "10px", border: "none" }}>
                                    <FaFacebookF />
                                </button>
                                <button style={{ backgroundColor: "#333", color: "#fff", borderRadius: "50%", padding: "10px", border: "none" }}>
                                    <FaGithub />
                                </button>
                                <button style={{ backgroundColor: "#0e76a8", color: "#fff", borderRadius: "50%", padding: "10px", border: "none" }}>
                                    <FaLinkedinIn />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
        
    );
};

export default Login;
