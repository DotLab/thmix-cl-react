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
import EditUserDetail from './components/EditUserDetail';

import Help from './components/posts/Help';
import Terms from './components/posts/Terms';
import Privacy from './components/posts/Privacy';
import Copyright from './components/posts/Copyright';

import DefaultAvatar from './components/DefaultAvatar.jpg';

import {TEST_EMAIL, TEST_PASSWORD} from './secrets';

// const debug = require('debug')('thmix:App');

const VERSION = 0;
const INTENT = 'web';

const DEVELOPMENT = 'development';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.history = props.history;
    this.socket = props.socket;
    this.isDevelopment = props.env === DEVELOPMENT;

    this.supportFileUpload = File && FileReader;

    this.state = {
      isHandshakeSuccessful: false,
      user: null,
      error: null,
      success: null,
    };

    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('reconnect', this.onReconnect.bind(this));

    this.handshake();
  }

  error(message) {
    if (typeof message === 'string') this.setState({error: message});
  }

  success(message) {
    this.setState({success: message});
    setTimeout(() => this.setState({success: null}), 1500);
  }

  onDisconnect() {
    this.setState({
      isHandshakeSuccessful: false,
      user: null,
    });

    this.error('disconnected');
  }

  async onReconnect() {
    this.setState({error: null});

    await this.handshake();
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
    await this.genericApi1('cl_handshake', {version: VERSION, intent: INTENT});
    this.setState({isHandshakeSuccessful: true});

    if (this.isDevelopment) {
      await this.login({recaptcha: '', email: TEST_EMAIL, password: TEST_PASSWORD});
    }
  }

  async registerPre({recaptcha, name, email}) {
    await this.genericApi1('cl_web_register_pre', {recaptcha, name, email});
  }

  async register({code, name, email, password}) {
    await this.genericApi1('cl_web_register', {code, name, email, password});
    this.history.push('/login');
  }

  async login({recaptcha, email, password}) {
    const user = await this.genericApi1('cl_web_login', {recaptcha, email, password});
    this.setState({user});

    if (!this.isDevelopment) {
      this.history.replace('/');
    }
  }

  async getUser({userId}) {
    const user = await this.genericApi1('cl_web_get_user', {userId});
    return user;
  }

  async userUpdateBio({bio}) {
    const user = await this.genericApi1('cl_web_user_update_bio', {bio});
    this.setState({user});
    this.success('bio updated');
  }

  async userUploadAvatar({size, buffer}) {
    const user = await this.genericApi1('cl_web_user_upload_avatar', {size, buffer});
    this.setState({user});
    this.success('avatar uploaded');
  }

  async userUpdatePassword({currentPassword, newPassword}) {
    await this.genericApi1('cl_web_user_update_password', {currentPassword, password: newPassword});
    this.success('password updated');
  }

  render() {
    const s = this.state;

    if (s.waiting) return <div></div>;

    return <div>
      {(s.error || s.success) && <div className="Pe(n) Z(1) position-fixed w-100 text-center">
        {s.error && <span className="d-inline-block alert alert-danger p-2 shadow"><strong>Error</strong>: {s.error}</span>}
        {s.success && <span className="d-inline-block alert alert-success p-2 shadow"><strong>Success</strong>: {s.success}</span>}
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
            {!s.user ? <ul className="navbar-nav">
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/login">login</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/register">register</NavLink></li>
            </ul> : <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={`/users/${s.user.id}`}><img className="W(2em) d-inline-block rounded" src={s.user.avatarUrl || DefaultAvatar} alt=""/></Link>
              </li>
            </ul>}
          </div>
        </div>
      </nav>

      <Switch>
        <Route exact path="/" component={Home} />
        <PropsRoute path="/login" component={Login} app={this}/>
        <PropsRoute path="/register" component={Register} app={this}/>

        <PropsRoute exact path="/midis" component={MidiListing} />
        <PropsRoute path="/midis/:midiId" component={MidiDetail} />
        <PropsRoute exact path="/users" component={UserListing} />
        <PropsRoute exact path="/users/:userId" component={UserDetail} app={this} />
        <PropsRoute path="/users/:userId/edit" component={EditUserDetail} app={this} />

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
