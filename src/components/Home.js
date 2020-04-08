import React from 'react';
import HomeShowcase from './HomeShowcase.jpg';

import {rpc} from '../apiService';

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
        style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, .8)), url(${HomeShowcase})`}}
      >
        <div><small>{s.revision}</small></div>
        <div><small>{s.playerCount} players, {s.onlineCount} currently online in {s.gameCount} games</small></div>
        <h2 className="Mt(100px) h4 font-weight-normal font-italic mb-0">Touhou Mix: A Touhou Project Music Game</h2>
        <small className="C($pink)">Perform Touhou Project music on your device!</small>
        <div className="mt-3">
          <a className="btn btn-primary ml-2" href="https://itunes.apple.com/us/app/touhou-mix-a-touhou-game/id1454875483">App Store <i className="fab fa-app-store"></i></a>
          <a className="btn btn-primary ml-2" href="https://testflight.apple.com/join/fM6ung3w">App Store Beta <i className="fab fa-app-store"></i></a>
        </div>
        <div className="mt-2">
          <a className="btn btn-success ml-2" href="https://play.google.com/store/apps/details?id=kailang.touhoumix">Google Play <i className="fab fa-google-play"></i></a>
          <a className="btn btn-success ml-2" href="https://play.google.com/apps/testing/kailang.touhoumix">Google Play Beta <i className="fab fa-google-play"></i></a>
        </div>
        <div className="mt-2">
          <a className="btn btn-info ml-2" href="https://discord.gg/m2BeMbj">Join Discord <i className="fab fa-discord"></i></a>
        </div>
        <div className="Mt(100px) small text-center">peak at {s.peakOnlineCount} online players</div>
      </div>
    </section>;
  }
}

export default App;
