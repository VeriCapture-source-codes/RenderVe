import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import defaultUserImage from '../assets/images/user.png';
import './Header.css'; 

const Header = ({ user, userEmail }) => {
  return (
    <Navbar bg="white" expand="lg" className="custom-navbar">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="#">
          <img
            src="/logo.png"
            alt="VeriCapture Logo"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        {/* Center Navigation Links */}
        <Nav className="nav-center">
          <Nav.Link href="#" className="custom-nav-link active">Home</Nav.Link>
          <Nav.Link href="#" className="custom-nav-link">RealTime Capture</Nav.Link>
          <Nav.Link href="#" className="custom-nav-link">Map</Nav.Link>
          <Nav.Link href="#" className="custom-nav-link">Trending</Nav.Link>
        </Nav>

        {/* Right User Section */}
        <div className="user-section">
          <i className="bi bi-moon theme-toggle-icon" />

          <Dropdown>
            <Dropdown.Toggle variant="light" className="user-dropdown">
              <div className="user-info">
                <div className="user-email">{userEmail || 'Guest'}</div>
                <div className="user-location">Lagos, Nigeria</div>
              </div>
              <img
                src={user?.data?.thumbnail || defaultUserImage}
                alt="User"
                width="36"
                height="36"
                className="user-image"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#">Profile</Dropdown.Item>
              <Dropdown.Item href="#">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
