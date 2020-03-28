import React from 'react';

import DeployedBranches from './DeployedBranches';
import { Loading, useApi, repeat, thenRepeat, prom, get } from '../hooks';

export default function Branches() {
  return (
    <Loading
      message="Loading Git Branches"
      result={useApi('operator', 'getBranches', repeat(prom(get()), thenRepeat(5000)))}
    >{
      branches => (
        <DeployedBranches branches={branches} />
      )
    }</Loading>
  );
}
