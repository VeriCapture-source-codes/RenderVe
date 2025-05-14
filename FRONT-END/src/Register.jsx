import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import './Register.css'
import { toast, Toaster } from "react-hot-toast";
import { apiRequest } from "./utils/api";

const countries = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "India", "China", "Japan",
  "Brazil", "Australia", "Mexico", "Italy", "South Korea", "Spain", "Russia", "Netherlands",
  "Sweden", "Norway", "Denmark", "Finland", "New Zealand", "South Africa", "Nigeria", "Kenya",
  "Egypt", "Argentina", "Chile", "Colombia", "Turkey", "Poland", "Portugal", "Ukraine",
  "Philippines", "Malaysia", "Singapore", "Thailand", "Vietnam", "Indonesia", "Pakistan", "Bangladesh"
];

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
    
});
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const emailRege = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, userName, password} = form;

    if (!firstName || !lastName || !email || !userName || !password ) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (firstName.length < 2 || lastName.length < 2 || userName.length < 2) {
      toast.error('First name, last name, and username must be at least 2 characters.');
      return;
    }

    if (!emailRege.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setPasswordError('Your password must be more than four characters.');
      return;
    } else {
      setPasswordError('');
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest({
        method: 'POST',
        route: '/users/create-form',
        body: { 
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          userName: form.userName,
          password: form.password,
        },
      });

      console.log("Signup Response:", response);

      if (response.success) {
        toast.success('Account created successfully! Redirecting...');
        setShouldRedirect(true);
      } else {
        toast.error(typeof response.message === 'string' ? response.message : 'Signup failed.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        console.log("Redirecting to /login...");
        navigate('/login');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, navigate]);

  return (
    <div className="auth-container">
    <Toaster position="top-center" reverseOrder={false} />

    <div className="auth-image">
      <img src="/image6.png" alt="network" className="signup-image" />
    </div>

    <div className="auth-right">
      <div className="auth-logo">
      <img src="/vericapture.png" alt="logo" /> </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <h1 className="signup-title">Create an account</h1>
        <p>Already have an account? <a href="./login">Log in </a> </p>

        <div style={{ display:'flex', gap:'10px'}}>
          <input
            name="firstName"
            type="text"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="userName"
          type="text"
          placeholder="Create Username"
          value={form.userName}
          onChange={handleChange}
        />

<div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name= "password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    className={`input-full ${passwordError ? "input-error" : ""}`}
    required
  />
  <span className="toggle-password" onClick={togglePasswordVisibility}>
    {showPassword ? (
      <EyeIcon className="eye-icon" size={20} />
    ) : (
      <EyeOffIcon className="eye-icon" size={20} />
    )}
  </span>
   {passwordError && <p className="error-text">{passwordError}</p>}
</div>

        <select
          name="country"
          className="input-full"
          value={form.country}
          onChange={handleChange}
        >
          <option value="">Select Location</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <div className="terms-container">
          <input
            id="terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          <label htmlFor='terms'>
            I agree to the <a href="#">Terms and Conditions</a>
          </label>
        </div>

         <button
          type="submit"
          className={`submit-btn ${agreeTerms ? "" : "disabled"}`}
          disabled={
            !agreeTerms ||
            isSubmitting ||
            !form.firstName ||
            !form.lastName ||
            !form.email ||
            !form.userName ||
            !form.password ||
            !form.country ||
            form.firstName.length < 2 ||
            form.lastName.length < 2 ||
            form.userName.length < 2 ||
            !emailRege.test(form.email) ||
            form.password.length < 4
          }
        >
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>

        <div className="divider">
        <span>or sign up with</span> 
        </div>

           {/* Social Buttons */}
          <div className="social-buttons">
            <button className="social-button" arial-label="Sign in with Google">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.5-6 7.5-11.3 7.5-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C33.4 5.1 28.9 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.9-8.9 19.9-20 0-1.3-.1-2.7-.3-3.5z"/>
    <path fill="#e53935" d="M6.3 14.7l6.6 4.8c1.8-3.5 5.1-6.1 9.1-6.9V4.2C14.4 5.3 8.9 9.2 6.3 14.7z"/>
    <path fill="#4caf50" d="M24 44c4.8 0 9.2-1.6 12.7-4.3l-5.9-4.8C28.6 36.2 26.4 37 24 37c-5.3 0-9.6-3-11.4-7.5l-6.5 5c3 6.1 9.3 10.5 17.9 10.5z"/>
    <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-0.7 1.8-1.9 3.5-3.3 4.8l5.9 4.8c-0.4 0.3 7.1-6.6 7.1-17.1 0-1.3-.1-2.7-.3-3.5z"/>
    </svg>
    </button>

    <button className="social-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path fill="#3b5998" d="M29 0H3C1.4 0 0 1.4 0 3v26c0 1.6 1.4 3 3 3h13V20h-4v-5h4v-3c0-4 2.4-6.3 6-6.3 1.7 0 3.1.1 3.5.2v4h-2.4c-1.9 0-2.3.9-2.3 2.2V15h5l-1 5h-4v12h8c1.6 0 3-1.4 3-3V3c0-1.6-1.4-3-3-3z"/>
</svg>
  </button>

  <button className="social-button">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227">
  <path fill="#000" d="M723 568L1169 0H1070L677 500 349 0H0L471 711 0 1227H99L518 694l351 533h349L723 568zM568 619l-51-76L136 74h166l273 410 51 76 417 625H877L568 619z"/>
</svg>
</button>
</div>

</form>
</div>
</div>
  );
}

export default Register;
