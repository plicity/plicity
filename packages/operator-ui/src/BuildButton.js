import React from 'react';

export default function BuildButton({building, onClick, children}) {
  return (
    <button className="btn btn-sm btn-secondary" onClick={onClick} disabled={building}>
      {building
        ? (<span className="spinner-grow spinner-grow-sm"></span>)
        : (<i className="fas fa-stream"></i>)
      }
      <span className="pl-2">{children}</span>
    </button>
  );
}