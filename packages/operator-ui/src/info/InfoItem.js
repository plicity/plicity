import React from 'react';

import {Context} from '../ClientContext';

import Image from './Image';
import BuildButton from '../BuildButton';

export default function CloudInfo({info: {name, version, type}}) {
  return (
    <li className="list-group-item">
      <div className="d-flex">
        <Image type={type} className="m-2 mr-4" />
        <div className="w-100">
          <div className="d-flex justify-content-between">
            <h5 className="mb-1">{name}</h5>
          </div>
          <Version>{version}</Version>
          {type === 'plicity' && <OperatorBuildButton />}
        </div>
      </div>
    </li>
  );
}

function Version({children}) {
  if (!children) {
    return null;
  }

  return (
    <div className="text-muted my-1">
      {children.split('\n').map((line, index) => (<div key={index} className="my-0 version">{line}</div>))}
    </div>
  );
}

function OperatorBuildButton() {
  const client = React.useContext(Context);
  const [building, setBuilding] = React.useState();
  const onClickBuild = React.useCallback(async () => {
    setBuilding(true);
    try {
      await client.apis.operator.buildOperator();
    } finally {
      setBuilding(false);
    }
  }, [client]);

  return (
    <BuildButton onClick={onClickBuild} building={building}>Rebuild</BuildButton>
  );
}