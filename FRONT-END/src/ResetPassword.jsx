import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from './utils/api'; 
import { Eye, EyeOff } from 'lucide-react'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 


function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.newPassword || !form.confirmPassword) {
      setMessage('Please fill in both password fields.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiRequest({
        method: 'POST',
        route: '/users/reset-password',
        body: {
          email: email,
          newPassword: form.newPassword,
        },
      });

      console.log('Reset Password Response:', data);

      if (data.success) {
        setMessage('Password reset successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
         }, 1000);
        

      } else {
        setMessage(data.message || 'Password reset failed.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

      {/* Logo */}
      <div className="absolute top-4 left-4">
        <img src="/vericapture img.png" alt="Logo" className="h-8" />
      </div>

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-center">Reset Password</h2>

        {/* Lock Image */}
        <div className="flex justify-center mb-6">
          <img src="/resetPassword img.png" alt="Lock Icon" className="h-12" />
        </div>

        {/* New Password Field */}
        <div className="mb-4 relative">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="newPassword">
            New Password
          </label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline pr-10"
            placeholder="Enter new password"
          />
          <div
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute top-9 right-3 cursor-pointer text-gray-600"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4 relative">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline pr-10"
            placeholder="Confirm new password"
          />
          <div
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute top-9 right-3 cursor-pointer text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {message && <p className="mb-4 text-center text-sm text-red-500">{message}</p>}

        <button
          type="submit"
          className="w-full py-2 text-white bg-black rounded hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
