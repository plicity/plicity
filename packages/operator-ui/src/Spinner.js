import React from 'react';

export default function Spinner({children}) {
  return (
    <div className="text-center my-4">
      <span className="text-muted">
        <i className="fas fa-circle-notch fa-spin"></i> {children}
      </span>
    </div>
  );
}
