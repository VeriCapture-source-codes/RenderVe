import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
      <Spinner animation="border" variant="primary" role="status" />
    </div>
  );
};

export default Loader;
