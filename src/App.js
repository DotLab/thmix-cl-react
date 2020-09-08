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
import ResourceListing from './components/ResourceListing';
import ResourceDetailEdit from './components/ResourceDetailEdit';
import ResourceUpload from './components/ResourceUpload';
import BuildUpload from './components/BuildUpload';
import BuildDetailEdit from './components/BuildDetailEdit';
import AlbumDetailEdit from './components/AlbumDetailEdit';
import AlbumListing from './components/AlbumListing';
import AlbumCustomizedListing from './components/AlbumCustomizedListing';
import SongDetailEdit from './components/SongDetailEdit';
import PersonDetailEdit from './components/PersonDetailEdit';

import Board from './components/Board';

import CardListing from './components/CardListing';
import CardDetailEdit from './components/CardDetailEdit';
import CardPoolListing from './components/CardPoolListing';
import CardPoolDetailEdit from './components/CardPoolDetailEdit';

import TranslationEdit from './components/TranslationEdit';
import VersionListing from './components/VersionListing';
import ErrorListing from './components/ErrorListing';

import Help from './components/posts/Help';
import Terms from './components/posts/Terms';
import Privacy from './components/posts/Privacy';
import Copyright from './components/posts/Copyright';

import DefaultAvatar from './components/DefaultAvatar.jpg';

import {TEST_EMAIL, TEST_PASSWORD} from './secrets';

import {getCurrentDay} from './utils';

// @ts-ignore
import langs from './json/langs.json';

import {setApp as apiServiceSetApp} from './apiService';
import {setApp as translationServiceSetApp, TranslationContext, Translation as Tr, saveLang, clearTranslationCache, UI_VOLATILE} from './translationService';
import CardPoolDetail from './components/CardPoolDetail';

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
    this.onLangChange = this.onLangChange.bind(this);

    this.state = {
      isHandshakeSuccessful: false,
      user: null,
      error: null,
      success: null,
      lang: 'en',
      translationDict: {},
    };

    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('reconnect', this.onReconnect.bind(this));

    this.handshake();
    this.albumCreate = this.albumCreate.bind(this);
    this.songCreate = this.songCreate.bind(this);
    this.personCreate = this.personCreate.bind(this);
    this.cardCreate = this.cardCreate.bind(this);
    this.cardPoolCreate = this.cardPoolCreate.bind(this);

    apiServiceSetApp(this);
    translationServiceSetApp(this);
  }

  onLangChange(e) {
    const lang = e.target.value;
    this.setState({lang});
    saveLang(lang);
  }

  error(message) {
    if (typeof message === 'string') this.setState({error: message});
  }

  success(message) {
    this.setState({error: null, success: message});
    setTimeout(() => this.setState({success: null}), 3000);
  }

  onDisconnect() {
    this.setState({
      isHandshakeSuccessful: false,
      user: null,
    });

    if (this.history.location.pathname === '/register') {
      this.error('disconnected, register failed');
      this.history.push('/');
    } else {
      this.error('disconnected');
    }
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

    const sessionTokenHash = localStorage.getItem('sessionTokenHash');
    if (sessionTokenHash) {
      this.resumeSession(sessionTokenHash);
    } else {
      if (this.isDevelopment) {
        await this.userLogin({recaptcha: '', email: TEST_EMAIL, password: TEST_PASSWORD});
      }
    }
  }

  async resumeSession(hash) {
    try {
      const user = await this.genericApi1('cl_web_user_resume_session', {hash});
      this.setState({user});
      this.success('session resumed');
    } catch (e) {
      localStorage.removeItem('sessionTokenHash');
    }
  }

  clearSession() {
    localStorage.removeItem('sessionTokenHash');
    this.success('auto login cleared');
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
    localStorage.setItem('sessionTokenHash', user.sessionTokenHash);
    this.history.replace('/');
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

  async midiList({albumId, songId, status, sort, page, search}) {
    const midis = await this.genericApi1('cl_web_midi_list', {albumId, songId, status, sort, page, search});
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

  async resourceUpload({name, size, buffer}) {
    const res = await this.genericApi1('cl_web_resource_upload', {name, size, buffer});
    this.success('resource uploaded');

    if (res.duplicated === true) {
      this.history.push(`/resources/${res.id}`);
    } else {
      this.history.push(`/resources/${res.id}/edit`);
    }
  }

  async resourceGet({id}) {
    const resource = await this.genericApi1('cl_web_resource_get', {id});
    return resource;
  }

  async resourceUpdate(update) {
    const resource = await this.genericApi1('cl_web_resource_update', update);
    this.success('resource updated');

    return resource;
  }

  async resourceList({type, status, sort, page}) {
    const resources = await this.genericApi1('cl_web_resource_list', {type, status, sort, page});
    return resources;
  }

  async buildUpload({name, size, buffer}) {
    const res = await this.genericApi1('cl_web_build_upload', {name, size, buffer});
    this.success('build uploaded');

    if (res.duplicated === true) {
      this.history.push(`/builds/${res.id}`);
    } else {
      this.history.push(`/builds/${res.id}/edit`);
    }
  }

  async buildGet({id}) {
    const build = await this.genericApi1('cl_web_build_get', {id});
    return build;
  }

  async buildUpdate(update) {
    const build = await this.genericApi1('cl_web_build_update', update);
    this.success('build updated');

    return build;
  }

  async midiBestPerformance({id}) {
    const bestPerformance = await this.genericApi1('cl_web_midi_best_performance', {id});
    return bestPerformance;
  }

  async midiMostPlayed({id}) {
    const mostPlayed = await this.genericApi1('cl_web_midi_most_played', {id});
    return mostPlayed;
  }

  async midiRecentlyPlayed({id}) {
    const recent = await this.genericApi1('cl_web_midi_recently_played', {id});
    return recent;
  }

  async midiPlayHistory({id, interval}) {
    switch (interval) {
      case '1m':
        interval = 1 * 60 * 1000;
        break;
      case '2m':
        interval = 2 * 60 * 1000;
        break;
      case '5m':
        interval = 5 * 60 * 1000;
        break;
      case '15m':
        interval = 15 * 60 * 1000;
        break;
      case '30m':
        interval = 30 * 60 * 1000;
        break;
      case '1h':
        interval = 60 * 60 * 1000;
        break;
      case '1d':
        /* fall through */
      default:
        interval = 24 * 60 * 60 * 1000;
    }
    const hist = await this.genericApi1('cl_web_midi_play_history', {id, startDate: new Date(0), endDate: getCurrentDay(), interval});
    return hist;
  }

  async albumCreate() {
    const res = await this.genericApi0('cl_web_album_create');
    this.success('album created');

    if (res.duplicated === true) {
      this.history.push(`/albums/${res.id}`);
    } else {
      this.history.push(`/albums/${res.id}/edit`);
    }
  }

  async songCreate() {
    const res = await this.genericApi0('cl_web_song_create');
    this.success('song created');

    if (res.duplicated === true) {
      this.history.push(`/songs/${res.id}`);
    } else {
      this.history.push(`/songs/${res.id}/edit`);
    }
  }

  async personCreate() {
    const res = await this.genericApi0('cl_web_person_create');
    this.success('person created');

    if (res.duplicated === true) {
      this.history.push(`/persons/${res.id}`);
    } else {
      this.history.push(`/persons/${res.id}/edit`);
    }
  }

  async cardCreate() {
    const res = await this.genericApi1('ClWebCardCreate', {});
    this.success('card created');

    this.history.push(`/cards/${res.id}/edit`);
  }

  async cardPoolCreate() {
    const res = await this.genericApi1('ClWebCardPoolCreate', {});
    this.success('cardPool created');

    this.history.push(`/cardpools/${res.id}/edit`);
  }

  async albumGet({id}) {
    const album = await this.genericApi1('cl_web_album_get', {id});
    return album;
  }

  async albumUploadCover({id, size, buffer}) {
    const album = await this.genericApi1('cl_web_album_upload_cover', {id, size, buffer});
    this.success('cover uploaded');
    return album;
  }

  async albumUpdate(update) {
    const album = await this.genericApi1('cl_web_album_update', {...update, lang: this.state.lang});
    this.success('album updated');

    return album;
  }

  async songGet({id}) {
    const song = await this.genericApi1('cl_web_song_get', {id});
    return song;
  }

  async songUpdate(update) {
    const song = await this.genericApi1('cl_web_song_update', {...update, lang: this.state.lang});
    this.success('song updated');

    return song;
  }

  async personGet({id}) {
    const person = await this.genericApi1('cl_web_person_get', {id});
    return person;
  }

  async personUploadAvatar({id, size, buffer}) {
    const person = await this.genericApi1('cl_web_person_upload_avatar', {id, size, buffer});
    this.success('cover uploaded');
    return person;
  }

  async personUpdate(update) {
    const person = await this.genericApi1('cl_web_person_update', update);
    this.success('person updated');

    return person;
  }

  async albumList({page}) {
    const albums = await this.genericApi1('cl_web_album_list', {page});
    return albums;
  }

  async albumInfoList() {
    const albums = await this.genericApi0('cl_web_album_info_list');
    return albums;
  }

  async songList({albumId}) {
    const songs = await this.genericApi1('cl_web_song_list', {albumId});
    return songs;
  }

  async authorList() {
    const authors = await this.genericApi0('cl_web_person_list');
    return authors;
  }

  async translationList() {
    return await this.genericApi1('cl_web_translation_list', {lang: this.state.lang});
  }

  render() {
    const s = this.state;

    return <TranslationContext.Provider value={s.translationDict}><div>
      {(s.error || s.success) && <div className="Pe(n) Z(1) position-fixed w-100 text-center">
        {s.error && <span className="d-inline-block alert alert-danger p-2 shadow"><strong><Tr src="error"/></strong>: <Tr ns={UI_VOLATILE} src={s.error}/></span>}
        {s.success && <span className="d-inline-block alert alert-success p-2 shadow"><strong><Tr src="success"/></strong>: <Tr ns={UI_VOLATILE} src={s.success}/></span>}
      </div>}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" exact to="/"><i className="fas fa-home"></i> <Tr src="home"/></NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/midis"><i className="fas fa-music"></i> <Tr src="midis"/></NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/songs"><i className="fas fa-info-circle"></i> <Tr src="songs"/></NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/soundfonts"><i className="fas fa-guitar"></i> <Tr src="soundfonts"/></NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/cards"><i className="fas fa-star"></i><Tr src="cards"/></NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/translations/edit"><i className="fas fa-language"></i> <Tr src="translations"/></NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/versions"><i className="fas fa-parachute-box"></i> <Tr src="versions"/></NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/errors"><i className="fas fa-bomb"></i> <Tr src="errors"/></NavLink></li>
              {/* <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/resources"><Tr src="resources"/></NavLink></li> */}
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/users"><i className="fas fa-user-friends"></i> <Tr src="users"/></NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/help"><i className="fas fa-question-circle"></i> <Tr src="help"/></NavLink></li>
              {/* <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/board"><Tr src="board"/></NavLink></li> */}
            </ul>
            <ul className="navbar-nav align-items-center">
              <span className="Cur(p) nav-link" onClick={clearTranslationCache}><i className="fas fa-sync-alt"></i></span>
              <li className="nav-item">
                <select className="Bdrs(5px)" onChange={this.onLangChange} value={this.state.lang}>
                  {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}
                </select>
              </li>
            </ul>
            {!s.user ? <ul className="navbar-nav align-items-center">
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/login"><Tr src="login"/></NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/register"><Tr src="register"/></NavLink></li>
            </ul> : <ul className="navbar-nav align-items-center">
              <li className="nav-item dropdown">
                <span className="Cur(p) nav-link dropdown-toggle" data-toggle="dropdown"><i className="fas fa-plus"></i></span>
                <div className="dropdown-menu dropdown-menu-right">
                  <Link className="dropdown-item" to="/midis/upload"><i className="fa-fw fas fa-upload"></i> <Tr src="upload midi"/></Link>
                  <Link className="dropdown-item" to="/soundfonts/upload"><i className="fa-fw fas fa-upload"></i> <Tr src="upload soundfont"/></Link>
                  <Link className="dropdown-item" to="/builds/upload"><i className="fa-fw fas fa-upload"></i> <Tr src="upload build"/></Link>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item Cur(p)" onClick={this.albumCreate}><i className="fa-fw fas fa-plus-square"></i> <Tr src="create album"/></div>
                  <div className="dropdown-item Cur(p)" onClick={this.songCreate}><i className="fa-fw fas fa-plus-square"></i> <Tr src="create song"/></div>
                  <div className="dropdown-item Cur(p)" onClick={this.personCreate}><i className="fa-fw fas fa-plus-square"></i> <Tr src="create person"/></div>
                  <div className="dropdown-item Cur(p)" onClick={this.cardCreate}><i className="fa-fw fas fa-plus-square"></i> <Tr src="create card"/></div>
                  <div className="dropdown-item Cur(p)" onClick={this.cardPoolCreate}><i className="fa-fw fas fa-plus-square"></i> <Tr src="create card pool"/></div>
                  {/* <Link className="dropdown-item" to="/resources/upload">upload resource</Link> */}
                  {/* <Link className="dropdown-item" to="/midis/upload">create story</Link> */}
                  {/* <a className="dropdown-item" href=".">Something else here</a> */}
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

        <PropsRoute exact path="/resources" component={ResourceListing} app={this} />
        <PropsRoute exact path="/resources/upload" component={ResourceUpload} app={this} />
        <PropsRoute exact path="/resources/:id/edit" component={ResourceDetailEdit} app={this} />

        <PropsRoute exact path="/cards" component={CardListing} app={this} />
        <PropsRoute exact path="/cards/:id/edit" component={CardDetailEdit} app={this} />
        <PropsRoute exact path="/cardpools" component={CardPoolListing} app={this} />
        <PropsRoute exact path="/cardpools/:id/" component={CardPoolDetail} app={this} />
        <PropsRoute exact path="/cardpools/:id/edit" component={CardPoolDetailEdit} app={this} />

        <PropsRoute exact path="/users" component={UserListing} app={this} />
        <PropsRoute exact path="/users/:id" component={UserDetail} app={this} />
        <PropsRoute exact path="/users/:id/edit" component={UserDetailEdit} app={this} />

        <PropsRoute exact path="/builds/upload" component={BuildUpload} app={this} />
        <PropsRoute exact path="/builds/:id/edit" component={BuildDetailEdit} app={this} />

        <PropsRoute exact path="/songs" component={AlbumListing} app={this} />
        <PropsRoute exact path="/songs/customized" component={AlbumCustomizedListing} app={this} />
        <PropsRoute exact path="/songs/:id/edit" component={SongDetailEdit} app={this} />

        <PropsRoute exact path="/albums/:id/edit" component={AlbumDetailEdit} app={this} />

        <PropsRoute exact path="/persons/:id/edit" component={PersonDetailEdit} app={this} />

        <PropsRoute exact path="/board" component={Board} app={this} />

        <PropsRoute exact path="/soundfonts" component={SoundfontListing} app={this} />
        <PropsRoute exact path="/soundfonts/upload" component={SoundfontUpload} app={this} />
        <PropsRoute exact path="/soundfonts/:id" component={SoundfontDetail} app={this} />
        <PropsRoute exact path="/soundfonts/:id/edit" component={SoundfontDetailEdit} app={this} />

        <PropsRoute exact path="/translations/edit" component={TranslationEdit} app={this} />

        <PropsRoute exact path="/versions" component={VersionListing} app={this} />
        <PropsRoute exact path="/errors" component={ErrorListing} app={this} />

        <PropsRoute exact path="/help" component={Help} />
        <PropsRoute exact path="/terms" component={Terms} />
        <PropsRoute exact path="/privacy" component={Privacy} />
        <PropsRoute exact path="/copyright" component={Copyright} />
      </Switch>

      <footer className="W(100%) Lh(18px) Bgc($gray-600) text-center py-1 shadow">
        <div className="container">
          <div className="small">
            <Link className="d-inline-block text-nowrap text-decoration-none text-light mr-4" to="/terms"><Tr src="terms"/></Link>
            <Link className="d-inline-block text-nowrap text-decoration-none text-light mr-4" to="/privacy"><Tr src="privacy"/></Link>
            <Link className="d-inline-block text-nowrap text-decoration-none text-light mr-4" to="/copyright"><Tr src="copyright(DMCA)"/></Link>
            <a className="d-inline-block text-nowrap text-decoration-none text-light mr-4" href="https://travis-ci.org/github/DotLab/touhou-mix-server-nodejs"><Tr src="server status"/></a>
            <a className="d-inline-block text-nowrap text-decoration-none text-light     " href="https://github.com/DotLab/touhou-mix-client-react"><Tr src="source code"/></a>
          </div>
          <div className="C($gray-500)">
            <small>Touhou Mix 2015-2020</small>
          </div>
        </div>
      </footer>
    </div></TranslationContext.Provider>;
  }
}
