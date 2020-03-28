import React from 'react';
import DeployedBranch from './DeployedBranch';

export default function DeployedBranches({branches}) {
  return (
    <React.Fragment>
      { branches.map(branch => (<DeployedBranch key={branch.name} branch={branch} />)) }
    </React.Fragment>
  );
};
