import React from 'react';
import {Route, Switch, Link, NavLink} from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

import Terms from './components/posts/Terms';
import Privacy from './components/posts/Privacy';
import Copyright from './components/posts/Copyright';

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
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" exact to="/">home</NavLink></li>
              {/* <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/midis">midis</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/soundfonts">soundfonts</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/rankings">rankings</NavLink></li> */}
            </ul>
            {/* <ul className="navbar-nav">
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/login">login</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" activeClassName="active" to="/register">register</NavLink></li>
            </ul> */}
          </div>
        </div>
      </nav>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />

        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/copyright" component={Copyright} />
      </Switch>

      <footer className="W(100%) Lh(18px) Bgc($gray-600) text-center py-1 shadow">
        <div className="container">
          <div className="small">
            <Link className="d-inline-block text-nowrap text-decoration-none text-light pr-4" to="/terms">terms</Link>
            <Link className="d-inline-block text-nowrap text-decoration-none text-light pr-4" to="/privacy">privacy</Link>
            <Link className="d-inline-block text-nowrap text-decoration-none text-light pr-4" to="/copyright">copyright(DMCA)</Link>
            {/* <a className="d-inline-block text-nowrap text-decoration-none text-light pr-4" href="http://thmix.cc/boot/report.php">server status</a> */}
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
