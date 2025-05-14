import './App.css'
import './Components/SideMenu.css'
import { Routes, Route } from 'react-router-dom'
import ForgotPassword from './ForgetPassword.jsx'
import VerifyResetOtp from './VerifyOtp.jsx'
import ResetPassword from './ResetPassword.jsx'
import {Toaster} from 'react-hot-toast'
import ExplorePage from './Explore.jsx'
import LoginPage from './Login.jsx'
import Register from './Register.jsx'
import Profile from './CreateProfile.jsx'
import LandingPage from './LandingPage.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home.jsx'

function App() {
  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }} />

      <Routes>
      <Route path="/" element={<LandingPage />} />

        {/* Home Page Router */}
      <Route path="/home" element={<Home/>} />

        {/* Forgot Password Router */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Verify Otp */}
        <Route path="/verify-otp" element={<VerifyResetOtp />} />

        {/* Reset Password */}
        <Route path="/password-page-reset" element={<ResetPassword />} />

        {/* Explore Page */}
        <Route path="/explore" element={<ExplorePage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Profile Page */}
        <Route path="/profile" element={<Profile />} />

     {/* 404 Page */}
      <Route
       path="*"
      element={
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
      <a
        href="/"
        className="inline-block px-6 py-2 text-white bg-black rounded hover:bg-gray-800 transition"
      >
        Go Home
      </a>
    </div>
  }
/>

</Routes>
    </div>
  )
}

export default App;
