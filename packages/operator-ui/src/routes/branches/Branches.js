import { h, Component } from 'preact';
import DeployedBranches from './DeployedBranches';
import operator from '../../client/operator';

export default class Branches extends Component {
	state = {
    branches: null
  };

  _timeout = undefined;

  componentDidMount() {
    this.startBranchLoading();
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  async startBranchLoading() {
    const res = await (await operator).apis.operator.getBranches();
    
    this.setState({branches: res.body});
    this._timeout = setTimeout(() => this.startBranchLoading(), 5000);
  }

	render({}, { branches }) {
    
    const items = [];

    if (branches) {
      items.push(
        <DeployedBranches key="deployed-branches" deployedBranches={branches} />
      );
    }

		return items;
	}
}
