import React from 'react';
import * as RR from 'react-router-dom';

import Header from './Header';
import Branches from './branches';
import Info from './info';
import Theme from './Theme';

export default function App() {
  return (
    <RR.BrowserRouter>
      <div id="app" className="p-0 container p-md-4">
        <Header />
        <div className="my-1 my-md-4">
          <RR.Switch>
            <RR.Route path="/info"><Info /></RR.Route>
            <RR.Route path="/theme"><Theme /></RR.Route>
            <RR.Route path="/"><Branches /></RR.Route>
          </RR.Switch>
        </div>
      </div>
    </RR.BrowserRouter>
  );
};
