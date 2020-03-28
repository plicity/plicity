import React from 'react';

export default function ErrorBox({children, task}) {
  return (
    <div className="alert alert-danger p-3 d-flex">
      <i className="fas fa-sad-cry fa-2x pr-4 my-auto"></i>
      <div className="w-100">
        <div className="d-flex justify-content-between">
          <b className="alert-heading">{task}</b>
        </div>
        <p className="mb-0">
          {stringifyError(children)}
        </p>
      </div>
    </div>
  )
};

function stringifyError(children) {
  if (typeof children === 'string') {
    return children;
  }

  if (children instanceof Error) {
    const {message, name} = children;
    return `(${name}) ${message}`;
  }

  return `Unknown Error`;
}