import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { apiRequest } from './utils/api'; 
import './Login.css';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    toast.error('Please fill in all fields.');
    return;
  }

  setIsSubmitting(true);

  try {
    const data = await apiRequest({
      method: 'POST',
      route: '/users/sign-in-user',
      body: {
        email: form.email,
        password: form.password,
      },
    });


    if(data.success){

      localStorage.setItem('authToken', data.data.data._id);
      localStorage.setItem('userEmail', data.data.data.email);

      toast.success(data.message+' Redirecting...');
      setTimeout(() => navigate('/home'), 500);
    }
    else {
      // Only show error if explicitly failed
      toast.error(data?.message || 'Login failed.');
    }



  } catch (error) {
    console.error('Login Error:', error);
    toast.error('An unexpected error occurred.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="login-container">
      <Toaster position="top-center" reverseOrder={false} />
  
      {/* Left image */}
      <div className="login-left">
        <img src="/image6.png" alt="image" className="login-image" />
      </div>
      
      {/* Right section */}
      <div className="login-right">
        <div className="logo">
          <img src="/vericapture.png" alt="Logo" className="logo-image" />
        </div>
        <h2>Welcome Back</h2>
        <p>Welcome back, please enter your detail</p>

        <div className='row'>
          <div className='col-12 mb-3'>
            <button className='btn btn-danger form-control loginbtn btn-no-radius'>
          <img src='../src/assets/images/google.png'/>
          Log in with Google</button>
          </div>
          <div className='col-6'>
            <button className='btn btn-primary form-control loginbtn btn-no-radius'>
          <img src='../src/assets/images/facebook.png'/>
          Log in with Facebook</button>
          </div> <div className='col-6'>
            <button className='btn btn-secondary form-control loginbtn btn-no-radius'>
          <img src='../src/assets/images/x.png'/>
          Log in with X</button>
          </div>
        </div>
    
    
<div className="divider">
        <span>OR</span> 
        </div>

      <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="input-box"
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="input-box"
              required
            />
            <span
              className="toggle-password"
              onClick={togglePasswordVisibility}>
              {showPassword ? <EyeIcon className="eye-icon" size={20} /> : <EyeOffIcon className="eye-icon" size={20} />}
            </span>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Keep me signed in
            </label>
            <Link to = "/forgot-password" className="forgot-link">Forgot Password</Link>
          </div>

          <button type="submit" className="sign-in-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'crimson' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
