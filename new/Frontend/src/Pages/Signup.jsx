import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useFormik } from 'formik';
import userValidationSchema from '../Validation/userValidationSchema'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: userValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            console.log('Form submitted with values:', values);
            try {
                const response = await axios.post(`${apiUrl}/register`, values, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setLoading(false);
                console.log("response:", response);
                if (response.status >= 200 && response.status < 300) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'You have signed up successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate('/create-task');
                    });
                }
                else {
                    console.log("Error:", response);

                    Swal.fire({
                        title: 'Error!',
                        text: 'Something went wrong. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                setLoading(false);
                console.log("Error:", error);
                if (error.response && error.response.status === 409) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Email already exists. Please use a different email.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred. Please try again later.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        },
    });

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: 'linear-gradient(135deg,rgb(45, 48, 51),rgb(15, 26, 126))',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              display: 'flex',
              background: '#fff',
              width: '80%',
              maxWidth: '1000px',
              boxShadow: '0 8px 24px rgba(32, 33, 42, 0.2)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              
              {/* Left Side */}
              <div style={{
                flex: '1',
                background: 'linear-gradient(135deg,rgb(11, 11, 12),rgb(30, 34, 155))',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
              }}>
                <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>Welcome Back!</h1>
                <p style={{ fontSize: '16px', marginBottom: '20px', textAlign: 'center' }}>
                  Already have an account?
                </p>
                <Link to="/login" style={{
                  padding: '10px 20px',
                  background: 'white',
                  color: 'black',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}>
                  Login
                </Link>
              </div>
      
              {/* Right Side (Signup Form) */}
              <div style={{
                flex: '1',
                padding: '40px',
                background: '#ffffff',
              }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Create Account</h2>
      
                <form onSubmit={formik.handleSubmit}>
      
                  {/* Name Field */}
                  <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <FaUser style={{ position: 'absolute', top: '14px', left: '12px', color: '#aaa' }} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Username"
                      {...formik.getFieldProps('name')}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '16px',
                      }}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formik.errors.name}</div>
                    )}
                  </div>
      
                  {/* Email Field */}
                  <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <FaEnvelope style={{ position: 'absolute', top: '14px', left: '12px', color: '#aaa' }} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      {...formik.getFieldProps('email')}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '16px',
                      }}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formik.errors.email}</div>
                    )}
                  </div>
      
                  {/* Password Field */}
                  <div style={{ marginBottom: '30px', position: 'relative' }}>
                    <FaLock style={{ position: 'absolute', top: '14px', left: '12px', color: '#aaa' }} />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      {...formik.getFieldProps('password')}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '16px',
                      }}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formik.errors.password}</div>
                    )}
                  </div>
      
                  {/* Submit Button */}
                  <button type="submit" disabled={loading} style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg,rgb(17, 18, 19),rgb(41, 52, 146))',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                  }}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
      
                </form>
      
              </div>
      
            </div>
          </div>
    );
};

export default Signup;
