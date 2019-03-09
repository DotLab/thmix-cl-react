import React from 'react';
import HomeShowcase from './HomeShowcase.png';

class App extends React.Component {
  render() {
    return <section className="container Pb(100px)">
      <div
        className="Bgp(c) Bgz(cv) px-4 py-3 text-light text-center text-lg-right shadow"
        style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, .8)), url(${HomeShowcase})`}}
      >
        <small>6069 players, 0 currently online in 0 games</small>
        <h2 className="Mt(100px) h4 font-weight-normal font-italic mb-0">Touhou Mix: A Touhou Project Music Game</h2>
        <small className="C($pink)">Perform Touhou Project music on your device!</small>
        <div className="mt-3">
          <a className="btn btn-primary mr-2" href="https://itunes.apple.com/us/app/touhou-mix-a-touhou-game/id1454875483">App Store <i className="fab fa-app-store"></i></a>
          <a className="btn btn-success     " href="https://play.google.com/store/apps/details?id=kailang.touhoumix">Google Play <i className="fab fa-google-play"></i></a>
        </div>
        <div className="Mt(100px) small text-center">peak at 2 online players</div>
      </div>
    </section>;
  }
}

export default App;
