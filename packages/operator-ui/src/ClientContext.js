import React from 'react';
import Swagger from 'swagger-client';

import { useResult, retry, Loading, prom } from './hooks';

export const Context = React.createContext();

export default function ClientContext({children}) {
  return (
    <Loading
      message="Loading Client"
      result={useResult(retry(5000, prom(() => Swagger('/api/operator/v1'))), [])}
    >{
      client => (
        <Context.Provider value={client}>
          {children}
        </Context.Provider>
      )
    }</Loading>
  );
};
