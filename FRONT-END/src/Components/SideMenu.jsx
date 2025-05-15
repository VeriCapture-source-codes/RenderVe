import React from "react";
import { Nav } from "react-bootstrap";
import "./SideMenu.css";

const SidebarMenu = () => {
  return (
    <div className="sidebar-container">
      <Nav defaultActiveKey="/home" className="sidebar-nav">
        <Nav.Link href="#" className="sidebar-link active">
          <i className="bi bi-house" />
          <span>Home</span>
        </Nav.Link>
        <Nav.Link href="#" className="sidebar-link">
          <i className="bi bi-compass" />
          <span>Explore</span>
        </Nav.Link>
        <Nav.Link href="#" className="sidebar-link">
          <i className="bi bi-bell" />
          <span>Notification</span>
        </Nav.Link>
        <Nav.Link href="#" className="sidebar-link">
          <i className="bi bi-person" />
          <span>Profile</span>
        </Nav.Link>
        <Nav.Link href="#" className="sidebar-link">
          <i className="bi bi-gear" />
          <span>Settings</span>
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default SidebarMenu;
