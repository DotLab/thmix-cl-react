import React from 'react';
import {Route, Switch, Link, NavLink} from 'react-router-dom';
import PropsRoute from './PropsRoute';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

import MidiListing from './components/MidiListing';
import MidiDetail from './components/MidiDetail';
import UserListing from './components/UserListing';
import UserDetail from './components/UserDetail';

import Help from './components/posts/Help';
import Terms from './components/posts/Terms';
import Privacy from './components/posts/Privacy';
import Copyright from './components/posts/Copyright';

const debug = require('debug')('thmix:App');

const VERSION = 0;
const INTENT = 'web';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.history = props.history;
    this.socket = props.socket;

    this.state = {
      isHandshakeSuccessful: false,
      error: null,
    };

    this.socket.on('disconnect', this.onDisconnect.bind(this));

    this.handshake();
  }

  error(message) {
    if (typeof message === 'string') this.setState({error: message});
  }

  onDisconnect() {
    this.error('disconnected');
  }

  genericApi0(event) {
    return new Promise((resolve, reject) => {
      this.socket.emit(event, (res) => {
        if (res.success === true) return resolve(res.data);
        this.error(res.data);
        if (typeof reject === 'function') reject(res.data);
      });
    });
  }

  genericApi1(event, arg1) {
    return new Promise((resolve, reject) => {
      this.socket.emit(event, arg1, (res) => {
        if (res.success === true) return resolve(res.data);
        this.error(res.data);
        if (typeof reject === 'function') reject(res.data);
      });
    });
  }

  async handshake() {
    const info = await this.genericApi1('cl_handshake', {version: VERSION, intent: INTENT});
    debug(info);
    this.setState({isHandshakeSuccessful: true});
  }

  render() {
    const s = this.state;
    return <div>
      {s.error && <div className="Z(1) position-fixed w-100 text-center">
        <span className="d-inline-block alert alert-danger p-2 shadow"><strong>Error</strong>: {s.error}</span>
      </div>}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" exact to="/">home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/midis">midis</NavLink></li>
              {/* <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/soundfonts">soundfonts</NavLink></li> */}
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/users">rankings</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/help">help</NavLink></li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/login">login</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/register">register</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>

      <Switch>
        <Route exact path="/" component={Home} />
        <PropsRoute path="/login" component={Login} />
        <PropsRoute path="/register" component={Register} app={this}/>

        <PropsRoute exact path="/midis" component={MidiListing} />
        <PropsRoute path="/midis/:midiId" component={MidiDetail} />
        <PropsRoute exact path="/users" component={UserListing} />
        <PropsRoute path="/users/:userId" component={UserDetail} />

        <PropsRoute path="/help" component={Help} />
        <PropsRoute path="/terms" component={Terms} />
        <PropsRoute path="/privacy" component={Privacy} />
        <PropsRoute path="/copyright" component={Copyright} />
      </Switch>

      <footer className="W(100%) Lh(18px) Bgc($gray-600) text-center py-1 shadow">
        <div className="container">
          <div className="small">
            <Link className="d-inline-block text-nowrap text-decoration-none text-light mr-4" to="/terms">terms</Link>
            <Link className="d-inline-block text-nowrap text-decoration-none text-light mr-4" to="/privacy">privacy</Link>
            <Link className="d-inline-block text-nowrap text-decoration-none text-light mr-4" to="/copyright">copyright(DMCA)</Link>
            <a className="d-inline-block text-nowrap text-decoration-none text-light mr-4" href="http://thmix.cc/boot/report.php">server status</a>
            <a className="d-inline-block text-nowrap text-decoration-none text-light     " href="https://github.com/DotLab">source code</a>
          </div>
          <div className="C($gray-500)">
            <small>Touhou Mix 2016-2019</small>
          </div>
        </div>
      </footer>
    </div>;
  }
}

export default App;
