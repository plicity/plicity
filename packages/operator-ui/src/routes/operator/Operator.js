import { h, Component, Fragment } from 'preact';
import BuildButton from '../../components/BuildButton';
import openshift from './openshift.svg';
import gitlab from './gitlab.svg';
import plicity from './simple-logo-sw.png';
import operator from '../../client/operator';

const IMAGE_HEIGHT = 64;

export default class Operator extends Component {

  state = {
    building: false,
    config: null
  };

  async componentDidMount() {
    // const config = await (await operator).apis.operator.getConfig();
    // this.setState({config}); // TODO(prenoth)
  }

  onClickBuildHandler = async () => {
    this.setState({building: true});

    try {
      await (await operator).apis.operator.buildOperator();
    } finally {
      this.setState({building: false});
    }
  };

  render({}, {building}) {
    return (
      <div class="list-group">
        <li class="list-group-item">
          <div class="d-flex">
            <img src={plicity} width={IMAGE_HEIGHT} class="m-2 mr-4" />
            <div class="w-100">
              <div class="d-flex justify-content-between">
                <h5 class="mb-1 plicity-text">PLICITY</h5>
                <small>subscription id <b>a29c-2f34-a891-ef23</b></small>
              </div>
              <h6 class="text-muted">v3.11.146</h6>
              <div>
                <BuildButton class="text-right" onClick={this.onClickBuildHandler} building={building}>Build</BuildButton>
              </div>
            </div>
          </div>
        </li>
        <li class="list-group-item">
          <div class="d-flex">
            <img src={openshift} width={IMAGE_HEIGHT} class="m-2 mr-4" />
            <div class="w-100">
              <div class="d-flex justify-content-between">
                <h5 class="mb-1">OpenShift</h5>
                <small>via service account <b>aitch</b></small>
              </div>
              <h6 class="text-muted">v3.11.146</h6>
            </div>
          </div>
        </li>
        <li class="list-group-item">
          <div class="d-flex">
            <img src={gitlab} width={IMAGE_HEIGHT} class="m-2 mr-4" />
            <div class="w-100">
              <h5 class="mb-1">Gitlab</h5>
              <h6 class="text-muted">12.7.5</h6>
            </div>
          </div>
        </li>
      </div>
    );
  }
}