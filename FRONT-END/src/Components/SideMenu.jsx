import React from 'react';
import { Nav } from 'react-bootstrap';

const SidebarMenu = () => {
  return (
    <div className="">
      <Nav defaultActiveKey="/home" className="flex-column text-secondary">
        <Nav.Link href="#" className=" mb-2 sidebar-link"><i className="bi bi-house me-2" /><span>Home</span></Nav.Link>
        <Nav.Link href="#" className='mb-2 sidebar-link'><i className="bi bi-compass me-2" /><span>Explore</span></Nav.Link>
        <Nav.Link href="#" className='mb-2 sidebar-link'><i className="bi bi-bell me-2" /><span>Notification</span></Nav.Link>
        <Nav.Link href="#" className='mb-2 sidebar-link'><i className="bi bi-person me-2" /><span>Profile</span></Nav.Link>
        <Nav.Link href="#" className='mb-2 sidebar-link'><i className="bi bi-gear me-2" /><span>Settings</span></Nav.Link>
      </Nav>
    </div>
  );
};

export default SidebarMenu;
