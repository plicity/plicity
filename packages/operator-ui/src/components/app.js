import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

import Branches from '../routes/branches';
import Operator from '../routes/operator';
import Theme from '../routes/theme';

export default class App extends Component {
	
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app" class="container my-4">
				<Header />
				<div class="my-4">
					<Router onChange={this.handleRoute}>
						<Branches path="/" />
						<Operator path="/operator" />
						<Theme path="/theme" />
					</Router>
				</div>
			</div>
		);
	}
}
