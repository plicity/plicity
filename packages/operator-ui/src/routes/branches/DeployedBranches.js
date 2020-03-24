import { h } from 'preact';
import DeployedBranch from './DeployedBranch';

export default ({ deployedBranches = [] }) => {
  const rows = deployedBranches.map(deployedBranch => (
    <DeployedBranch deployedBranch={deployedBranch} />
  ));

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">Branch</th>
          <th scope="col">Commit</th>
          <th scope="col">Build</th>
        </tr>
      </thead>
      <tbody>
        { rows }
      </tbody>
    </table>
  );
};