import React from 'react';
import * as RR from 'react-router-dom';
import plicityLogo from './simple-logo.png';
import plicityLogoSmall from './simple-logo-sm.png';

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-dark bg-dark">
        <RR.NavLink to="/" className="navbar-brand pr-2">
          <img src={plicityLogo} height="32" alt="" className="d-none d-md-block" />
          <img src={plicityLogoSmall} height="32" alt="" className="d-md-none" />
        </RR.NavLink>
        <ul className="nav nav-pills mr-auto">
          <li className="nav-item">
            <RR.NavLink to="/" className="nav-item nav-link" activeClassName="active" exact={true}>
              <i className="fas fa-code-branch"></i> <span className="d-none d-sm-inline">Branches</span>
            </RR.NavLink>
          </li>
          <li className="nav-item">
            <RR.NavLink to="/info" className="nav-item nav-link" activeClassName="active">
            <i className="fas fa-info"></i> <span className="d-none d-sm-inline">Info</span>
            </RR.NavLink>
          </li>
          {/* <li className="nav-item">
            <RR.NavLink to="/theme" className="nav-item nav-link" activeClassName="active">
              <i className="fas fa-mountain"></i> Theme
            </RR.NavLink>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};
