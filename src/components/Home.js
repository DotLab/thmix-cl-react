import React from 'react';
import 星月夜 from '../c7肘/星月夜.jpg';

import {rpc} from '../apiService';
import {Translation as Tr} from '../translationService';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      revision: '',
      playerCount: 0,
      onlineCount: 0,
      peakOnlineCount: 0,
      gameCount: 0,
    };
  }

  async componentDidMount() {
    const res = await rpc('ClWebServerStatus', null);
    this.setState(res);
  }

  render() {
    const s = this.state;

    return <section className="container Pb(100px)">
      <div
        className="Bgp(c) Bgz(cv) px-4 py-3 text-light text-center text-lg-right shadow"
        style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .6)), url(${星月夜})`}}
      >
        <div><small>{s.revision}</small></div>
        <div><small>{s.playerCount} <Tr src="players"/>, {s.onlineCount} <Tr src="currently online"/>, {s.gameCount} <Tr src="games"/></small></div>
        <div><small>illustration by <a className="C(white)" href="https://www.pixiv.net/en/artworks/34844544">c7肘</a></small></div>
        <h2 className="Mt(150px) h4 font-weight-normal font-italic mb-0">Touhou Mix: <Tr src="A Touhou Project Music Game"/></h2>
        <small className="C($pink)"><Tr src="Perform Touhou Project music on your device!"/></small>
        <div className="mt-3">
          <a className="btn btn-primary ml-2" href="https://itunes.apple.com/us/app/touhou-mix-a-touhou-game/id1454875483"><Tr src="App Store"/> <i className="fab fa-app-store"></i></a>
          <a className="btn btn-primary ml-2" href="https://testflight.apple.com/join/fM6ung3w"><Tr src="App Store Beta"/> <i className="fab fa-app-store"></i></a>
        </div>
        <div className="mt-2">
          <a className="btn btn-success ml-2" href="https://play.google.com/store/apps/details?id=kailang.touhoumix"><Tr src="Google Play"/> <i className="fab fa-google-play"></i></a>
          <a className="btn btn-success ml-2" href="https://play.google.com/apps/testing/kailang.touhoumix"><Tr src="Google Play Beta"/> <i className="fab fa-google-play"></i></a>
        </div>
        <div className="mt-2">
          <a className="btn btn-info ml-2" href="https://discord.gg/m2BeMbj"><Tr src="Join Discord"/> <i className="fab fa-discord"></i></a>
        </div>
        <div className="Mt(150px) small text-center"><Tr src="peak online players"/> {s.peakOnlineCount}</div>
      </div>
    </section>;
  }
}

export default App;
