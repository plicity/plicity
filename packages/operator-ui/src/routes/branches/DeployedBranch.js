import { h, Component } from 'preact';
import BuildButton from '../../components/BuildButton';
import operator from '../../client/operator';

export default class DeployedBranch extends Component {

  state = {
    building: false
  };

  onClickBuildHandler = async () => {
    this.setState({building: true});
    const {deployedBranch} = this.props;
    console.log(this.props);
    try {
      await (await operator).apis.operator.buildBranch({branch: deployedBranch.name});
    } finally {
      this.setState({building: false});
    }
  };

  render({ deployedBranch }, { building }) {
    return (
      <tr>
        <td><i class="fas fa-code-branch"></i> { deployedBranch.name }</td>
        <td>{ deployedBranch.commit }</td>
        <td><BuildButton onClick={this.onClickBuildHandler} building={building}>Rebuild</BuildButton></td>
      </tr>
    );
  }
};
