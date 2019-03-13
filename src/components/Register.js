import React from 'react';
import {Link} from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import {onChange, onChangeNamedDirect} from '../utils';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.app = this.props.app;

    this.onChange = onChange.bind(this);
    this.onRecaptchaChange = onChangeNamedDirect.bind(this, 'recaptcha');
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      recaptcha: null,
      username: null,
      email: null,
      password: null,
    };
  }

  onSubmit(e) {
    e.preventDefault();

    this.app.register(this.state);
  }

  render() {
    return <section className="container my-4">
      <form className="Maw(500px) Mx(a) shadow p-3 rounded" onSubmit={this.onSubmit}>
        <div className="form-group">
          <div className="form-group">
            <label>Username <span className="C($red)">*</span></label>
            <input className="form-control" type="text" required name="username" onChange={this.onChange}/>
            <small className="form-text text-muted">This will be your username.</small>
          </div>
          <label>Email address <span className="C($red)">*</span></label>
          <input className="form-control" type="email" required name="email" onChange={this.onChange}/>
          <small className="form-text text-muted">We'll never share your email address with anyone else.</small>
        </div>
        <div className="form-group">
          <label>Password <span className="C($red)">*</span></label>
          <input className="form-control" type="password" required name="password" onChange={this.onChange}/>
        </div>
        <div className="form-group">
          {/* <ReCAPTCHA sitekey="6LfMg5YUAAAAAAJr_ANH5TVvhoSHsJEa6oGSHw6f" onChange={this.onRecaptchaChange}/> */}
          <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={this.onRecaptchaChange}/>
        </div>
        <div className="form-group">
          <small className="form-text text-muted">By clicking “Register” below, you agree to our <Link to="/terms">terms of service</Link> and <Link to="/privacy">privacy policies</Link>.</small>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!this.state.recaptcha}>Register</button>
      </form>
    </section>;
  }
}

export default App;
