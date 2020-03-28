import React from 'react';

import { Loading, retry, prom, useApi, get } from '../hooks';
import InfoItem from './InfoItem';

export default function Info() {
  return (
    <Loading
      message="Loading Configuration"
      result={useApi('operator', 'getConfig', retry(5000, prom(get())))}
    >{
      config => (<div className="list-group">
        <InfoItem info={config.operator} />
        <InfoItem info={config.repository} />
        <InfoItem info={config.cloud} />
      </div>)
    }</Loading>
  );
};
