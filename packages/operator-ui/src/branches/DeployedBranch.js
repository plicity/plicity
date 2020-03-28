import React from 'react';
import BuildButton from '../BuildButton';
import { Context } from '../ClientContext';

export default function DeployedBranch({branch: {name, commit}}) {
  const client = React.useContext(Context);
  const [building, setBuilding] = React.useState(false);
  const onClickBuild = React.useCallback(async () => {
    setBuilding(true);

    try {
      await client.apis.operator.buildBranch({branch: name});
    } finally {
      setBuilding(false);
    }
  }, [client, name]);

  return (
    <div className="card">
      <div className="card-header">
        <i className="fas fa-code-branch"></i> { name }
      </div>
      <div className="card-body">
        <p className="text-truncate commit text-muted">{ commit }</p>
        <BuildButton onClick={onClickBuild} building={building}>Build</BuildButton>
      </div>
    </div>
  );
};
