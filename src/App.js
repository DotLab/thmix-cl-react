import React from 'react';

class App extends React.Component {
  render() {
    return <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active"><a className="nav-link" href="/">home</a></li>
              <li className="nav-item"><a className="nav-link" href="/midis">midis</a></li>
              <li className="nav-item"><a className="nav-link" href="/soundfonts">soundfonts</a></li>
              <li className="nav-item"><a className="nav-link" href="/rankings">rankings</a></li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link" href="/login">login</a></li>
              <li className="nav-item"><a className="nav-link" href="/register">register</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <section className="container">
        <div className="Bg($gray-800) px-4 py-3 text-light text-center text-lg-right shadow">
          <small>13,880,077 players, 12,444 currently online in 436 games</small>
          <h2 className="Mt(100px) h4 font-weight-normal font-italic mb-0">the bestest free-to-win rhythm game</h2>
          <small className="C($pink)">rhythm is just a click away</small>
          <div className="mt-3">
            <button className="btn btn-primary mr-2">App Store <i className="fab fa-app-store"></i></button>
            <button className="btn btn-success">Google Play <i className="fab fa-google-play"></i></button>
          </div>
          <div className="Mt(100px) small text-center">peak, 17,613 online users</div>
        </div>
      </section>

      <footer className="Pos(a) B(0) W(100%) Lh(18px) Bgc($gray-600) text-center py-1">
        <div className="container">
          <div className="text-light">
            <small className="d-inline-block text-nowrap pr-4">terms</small>
            <small className="d-inline-block text-nowrap pr-4">privacy</small>
            <small className="d-inline-block text-nowrap pr-4">copyright(DMCA)</small>
            <small className="d-inline-block text-nowrap pr-4">server status</small>
            <small className="d-inline-block text-nowrap">source code</small>
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
