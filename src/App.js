import React from 'react';
import logo from './thmix.png';

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
        <div className="Bgp(c) Bgz(cv) Bg(#00000088) px-4 py-3 text-light text-center text-lg-right shadow" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, .8)), url(${logo})`}}>
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

      <section className="container mt-4">
        <form className="Maw(500px) Mx(a) shadow p-3 rounded">
          <div class="form-group">
            <label>Email address</label>
            <input class="form-control" type="email" placeholder="Enter email"/>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-control" type="password" placeholder="Password"/>
          </div>
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
            <label class="form-check-label" for="exampleCheck1">Remember me</label>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </section>

      <section className="container mt-4">
        <form className="Maw(500px) Mx(a) shadow p-3 rounded">
          <div class="form-group">
            <label>Email address</label>
            <input class="form-control" type="email" placeholder="Enter email"/>
            <small class="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div class="form-group">
            <label>Display name</label>
            <input class="form-control" type="email" placeholder="Enter email"/>
            <small class="form-text text-muted">Public displaying name.</small>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-control" type="password" placeholder="Password"/>
          </div>
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
            <label class="form-check-label" for="exampleCheck1">I agree to the terms of service</label>
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
      </section>

      <footer className="W(100%) Lh(18px) Bgc($gray-600) mt-4 text-center py-1">
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
