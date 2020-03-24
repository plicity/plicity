import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import plicityIcon from './simple-logo.png';

export default class Header extends Component {
	render() {
		return (
			<header>
				<nav className="navbar navbar-dark bg-dark">
					<Link className="navbar-brand">
						<img src={plicityIcon} height="32" class="mr-2" />
					</Link>
					<ul className="nav nav-pills mr-auto">
						<li className="nav-item">
							<Link className="nav-item nav-link" activeClassName="active" href="/">
								<i class="fas fa-code-branch"></i> Branches
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-item nav-link" activeClassName="active" href="/operator">
								<i class="fas fa-brain"></i> Operator
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-item nav-link" activeClassName="active" href="/theme">
								<i class="fas fa-mountain"></i> Theme
							</Link>
						</li>
					</ul>
				</nav>
			</header>
		);
	}
}
