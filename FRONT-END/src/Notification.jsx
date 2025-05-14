import React from 'react';
import './Notification.css';

const NotificationPage = () => {
  return (
    <div className="notification-container">
      <div className="notification-box">
        <img src="/vericapture.png" alt="Notification Logo" className="notification-logo" />
        <h1 className="notification-title">🚧 Coming Soon!</h1>
        <p className="notification-message">
          We're working hard to bring you something amazing. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default NotificationPage;
