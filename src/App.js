import React from 'react';
import {Route, Switch, Link, NavLink} from 'react-router-dom';
import PropsRoute from './PropsRoute';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

import MidiListing from './components/MidiListing';
import MidiDetail from './components/MidiDetail';
import MidiDetailEdit from './components/MidiDetailEdit';
import MidiUpload from './components/MidiUpload';

import SoundfontListing from './components/SoundfontListing';
import SoundfontDetail from './components/SoundfontDetail';
import SoundfontDetailEdit from './components/SoundfontDetailEdit';
import SoundfontUpload from './components/SoundfontUpload';

import UserListing from './components/UserListing';
import UserDetail from './components/UserDetail';
import UserDetailEdit from './components/UserDetailEdit';

import Board from './components/Board';

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
    this.setState({error: null, success: message});
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
      await this.userLogin({recaptcha: '', email: TEST_EMAIL, password: TEST_PASSWORD});
    }
  }

  async userRegisterPre({recaptcha, name, email}) {
    await this.genericApi1('cl_web_user_register_pre', {recaptcha, name, email});
  }

  async userRegister({code, name, email, password}) {
    await this.genericApi1('cl_web_user_register', {code, name, email, password});
    this.history.push('/login');
  }

  async userLogin({recaptcha, email, password}) {
    const user = await this.genericApi1('cl_web_user_login', {recaptcha, email, password});
    this.setState({user});

    if (!this.isDevelopment) {
      this.history.replace('/');
    }
  }

  async userGet({id}) {
    const user = await this.genericApi1('cl_web_user_get', {id});
    return user;
  }

  async userList({page}) {
    const users = await this.genericApi1('cl_web_user_list', {page});
    return users;
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

  async midiUpload({name, size, buffer}) {
    const res = await this.genericApi1('cl_web_midi_upload', {name, size, buffer});
    this.success('midi uploaded');

    if (res.duplicated === true) {
      this.history.push(`/midis/${res.id}`);
    } else {
      this.history.push(`/midis/${res.id}/edit`);
    }
  }

  async midiGet({id}) {
    const midi = await this.genericApi1('cl_web_midi_get', {id});
    return midi;
  }

  async midiList({touhouAlbumIndex, touhouSongIndex, status, sort, page}) {
    const midis = await this.genericApi1('cl_web_midi_list', {touhouAlbumIndex, touhouSongIndex, status, sort, page});
    return midis;
  }

  async midiUpdate(update) {
    const midi = await this.genericApi1('cl_web_midi_update', update);
    this.success('midi updated');

    return midi;
  }

  async midiUploadCover({id, size, buffer}) {
    const midi = await this.genericApi1('cl_web_midi_upload_cover', {id, size, buffer});
    this.success('cover uploaded');

    return midi;
  }

  async soundfontUpload({name, size, buffer}) {
    const res = await this.genericApi1('cl_web_soundfont_upload', {name, size, buffer});
    this.success('soundfont uploaded');

    if (res.duplicated === true) {
      this.history.push(`/soundfonts/${res.id}`);
    } else {
      this.history.push(`/soundfonts/${res.id}/edit`);
    }
  }

  async soundfontUploadCover({id, size, buffer}) {
    const soundfont = await this.genericApi1('cl_web_soundfont_upload_cover', {id, size, buffer});
    this.success('cover uploaded');

    return soundfont;
  }

  async soundfontGet({id}) {
    const soundfont = await this.genericApi1('cl_web_soundfont_get', {id});
    return soundfont;
  }

  async soundfontUpdate(update) {
    const soundfont = await this.genericApi1('cl_web_soundfont_update', update);
    this.success('soundfont updated');

    return soundfont;
  }

  async soundfontList({status, sort, page}) {
    const soundfonts = await this.genericApi1('cl_web_soundfont_list', {status, sort, page});
    return soundfonts;
  }

  async boardGetMessages() {
    const messages = await this.genericApi0('cl_web_board_get_messages');
    return messages;
  }

  boardRequestMessageUpdate() {
    this.genericApi0('cl_web_board_request_message_update');
  }

  boardStopMessageUpdate() {
    this.genericApi0('cl_web_board_stop_message_update');
  }

  boardSendMessage({recaptcha, text}) {
    this.genericApi1('cl_web_board_send_message', {recaptcha, text});
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
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/soundfonts">soundfonts</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/users">users</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/help">help</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/board">board</NavLink></li>
            </ul>
            {!s.user ? <ul className="navbar-nav">
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/login">login</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/register">register</NavLink></li>
            </ul> : <ul className="navbar-nav align-items-center">
              <li className="nav-item dropdown">
                <span className="Cur(p) nav-link dropdown-toggle" data-toggle="dropdown">upload</span>
                <div className="dropdown-menu dropdown-menu-right">
                  <Link className="dropdown-item" to="/midis/upload">midi</Link>
                  <Link className="dropdown-item" to="/soundfonts/upload">soundfont</Link>
                  {/* <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href=".">Something else here</a> */}
                </div>
              </li>
              <li className="nav-item">
                <Link to={`/users/${s.user.id}`}><img className="W(2em) d-inline-block rounded" src={s.user.avatarUrl || DefaultAvatar} alt=""/></Link>
              </li>
            </ul>}
          </div>
        </div>
      </nav>

      <Switch>
        <Route exact path="/" component={Home} />
        <PropsRoute exact path="/login" component={Login} app={this}/>
        <PropsRoute exact path="/register" component={Register} app={this}/>

        <PropsRoute exact path="/midis" component={MidiListing} app={this} />
        <PropsRoute exact path="/midis/upload" component={MidiUpload} app={this} />
        <PropsRoute exact path="/midis/:id" component={MidiDetail} app={this} />
        <PropsRoute exact path="/midis/:id/edit" component={MidiDetailEdit} app={this} />

        <PropsRoute exact path="/users" component={UserListing} app={this} />
        <PropsRoute exact path="/users/:id" component={UserDetail} app={this} />
        <PropsRoute exact path="/users/:id/edit" component={UserDetailEdit} app={this} />

        <PropsRoute exact path="/board" component={Board} app={this} />

        <PropsRoute exact path="/soundfonts" component={SoundfontListing} app={this} />
        <PropsRoute exact path="/soundfonts/upload" component={SoundfontUpload} app={this} />
        <PropsRoute exact path="/soundfonts/:id" component={SoundfontDetail} app={this} />
        <PropsRoute exact path="/soundfonts/:id/edit" component={SoundfontDetailEdit} app={this} />

        <PropsRoute exact path="/help" component={Help} />
        <PropsRoute exact path="/terms" component={Terms} />
        <PropsRoute exact path="/privacy" component={Privacy} />
        <PropsRoute exact path="/copyright" component={Copyright} />
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
