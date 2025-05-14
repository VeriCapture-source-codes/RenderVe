import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const Landingpage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src="/vericapture img.png" alt="Logo" className="logo-img" />
          </div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">RealTime Capture</a>
          <a href="#">Map</a>
          <a href="#">Trending</a>
          <a href="#">About us</a>
        </div>
        <button className="signup-btn" onClick={() => navigate('./Register')}>Sign up</button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>It’s Not Here, <br />It Never Happened</h1>
        <p>Let’s Show you what is happening in your location</p>
        <div className="hero-buttons">
          <button className="explore-btn" onClick={() => navigate('./Home')}>Explore</button>
          <button className="login-btn" onClick={() => navigate('./Login')}>Login →</button>
        </div>
      </section>

      {/* Check Before You Step Out */}
      <section className="check-before">
        <h2><span>Check</span> before you step-out</h2>
        <p>
          With vericapture, you can see important emergency updates captured by heroes on the road, who have spared their lives to save yours
        </p>
        <button className="explore-btn" onClick={() => navigate('./Explore')}>Take a look</button>
      </section>

      {/* Report Card */}
      <section className="report-card">
        <div className="card">
          <strong>Kaycee Pastor</strong> <span>4hr ago</span>
          <p>Fuel tanker falls and caused serious traffic on Awka Onitsha Express way</p>
          <img src="/image.png" alt="Traffic report" />
          <div className="card-actions">
            <span>👍 63</span>
            <span>💬 3</span>
            <span>👁 37k</span> 
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <img src="/image15.png" alt="Live Map" className="map-img" />
        <div>
          <h2>See where it’s Happening</h2>
          <p>
            View live reports on events unfolding around you, so you always know what’s real and what’s not.
          </p>
          <button className="explore-btn" onClick={() => navigate('./Explore')}>Explore</button>
        </div>
      </section>

      {/* Lives Saved */}
      <section className="lives-saved">
        <h2>Over <span>500+</span> lives Saved</h2>
        <p>Thanks to the heroes we never met</p>
        <div className="avatars">
          <img src="/Frame 238.png" alt="avatar" />
           </div>
      </section>

      {/* What We Offer */}
      <section className="offer-section">
        <h2>What We Offer</h2>
        <p>
          At VeriCapture, we are committed to providing tools that empower users with accurate, real-time information they can trust.
        </p>
        <div className="offer-grid">
          <div className="offer-box">
            <h3>Authentic Content Sharing Made Easy</h3>
            <p>VeriCapture is a platform that empowers users to share real-time visual content directly, eliminating gallery uploads.</p>
          </div>
          <div className="offer-box">
            <h3>Emergency assistance resource</h3>
            <p>It provides live verification of content authenticity and geolocation, alerts users to potential misinformation, and connects them with emergency services when needed.</p>
          </div>
          <div className="offer-box">
            <h3>Location-Specific Content You Can Trust</h3>
            <p>Ensures access to real-time, location-specific content during emergencies or trending events, using AI verification and geolocation filters.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>
          <a href="#">Home</a>
          <a href="#">RealTime Capture</a>
          <a href="#">Map</a>
          <a href="#">Trending</a>
          <a href="#">About us</a>
        </div>
        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of service</a>
          <a href="#">Contact us</a>
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;
