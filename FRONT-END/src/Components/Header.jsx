import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import defaultUserImage from '../assets/images/user.png';

const Header = ({ user, userEmail }) => {
  return (
    <Navbar bg="white" expand="lg" className="px-4 shadow-sm">
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
        <Nav className="mx-auto">
          <Nav.Link href="#" className="custom-nav-link active">Home</Nav.Link>
          <Nav.Link href="#" className="custom-nav-link">RealTime Capture</Nav.Link>
          <Nav.Link href="#" className="custom-nav-link">Map</Nav.Link>
          <Nav.Link href="#" className="custom-nav-link">Trending</Nav.Link>
        </Nav>

        {/* Right User Section */}
        <div className="d-flex align-items-center">
          <i className="bi bi-moon me-3" />

          <Dropdown>
            <Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2">
              {/* Left side: name + location */}
              <div className="text-start">
                <div className="fw-semibold">{userEmail || 'Guest'}</div>
                <div className="text-muted small">Lagos, Nigeria</div>
              </div>

              {/* Right side: user image */}
              <img
                src={user?.data?.thumbnail || defaultUserImage}
                alt="User"
                width="36"
                height="36"
                className="rounded-circle"
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
