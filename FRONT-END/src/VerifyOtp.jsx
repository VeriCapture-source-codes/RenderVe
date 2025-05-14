import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from './utils/api';
import { toast } from 'react-hot-toast'; 

function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Read email from URL params (query string) or state
  const params = new URLSearchParams(location.search);
  const emailFromQuery = params.get('email');
  const emailFromState = location.state?.email;

  // Use the email from state first, then fallback to URL
  const email = emailFromState || emailFromQuery;

  
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!email) {
      toast.error('No email found! Please try again.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setMessage('Please enter the 6-digit OTP.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiRequest({
        method: 'POST',
        route: '/users/verify-otp',
        body: {
          email,
          OTP: fullOtp,
        },
      });

      if (data.success) {
        toast.success('✅ OTP verified! Redirecting...');
        setTimeout(() => {
          navigate('/password-page-reset', { state: { email } });
        }, 1500);
      } else {
        toast.error(data.message || '❌ OTP verification failed.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    try {
      const data = await apiRequest({
        method: 'POST',
        route: '/users/resend-otp',
        body: { email },
      });

      if (data.success) {
        toast.success('✅ New OTP sent successfully.');
        setResendTimer(30);
        const countdown = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(data.message || '❌ Failed to resend OTP.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    const maskedUser = user.length > 2
      ? '*'.repeat(user.length - 2) + user.slice(-2)
      : '*'.repeat(user.length);
    return `${maskedUser}@${domain}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="absolute top-4 left-4">
        <img src="/vericapture img.png" alt="Logo" className="h-10" />
      </div>

      <h1 className="text-2xl font-semibold mb-2">Check your Email</h1>

      <div className="mb-4">
        <img src="/email img.png" alt="Email Icon" className="h-12" />
      </div>

      <p className="text-center text-gray-600 mb-8">
        We have sent a 6 digit code to the Email Address <br />
        <span className="font-semibold">{maskEmail(email)}</span>
      </p>

      

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md">
        <div className="flex justify-between mb-4 w-full">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 border border-gray-400 rounded text-center text-xl focus:outline-none focus:border-black"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {message && (
          <p className="text-sm mb-4 text-center text-red-500">
            {message}
          </p>
        )}

        <div className="text-gray-600 text-sm mb-6">
          Didn't get a code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || resendTimer > 0}
            className={`font-semibold hover:underline ${
              (isResending || resendTimer > 0) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'
            }`}
          >
            {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-gray-400 hover:bg-gray-600 text-white py-2 px-6 rounded w-full mb-4 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Verifying...' : 'Verify Code'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/reset-password')}
          className="text-blue-600 text-sm font-semibold hover:underline"
        >
          &larr; BACK TO LOGIN
        </button>
      </form>
    </div>
  );
}

export default VerifyResetOtp;
