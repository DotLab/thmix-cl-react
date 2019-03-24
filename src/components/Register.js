import React from 'react';
import {Link} from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import {onChange, onChangeNamedDirect} from '../utils';
import {RECAPTCHA_KEY, TEST_RECAPTCHA_KEY} from '../secrets';

class App extends React.Component {
  constructor(props) {
    super(props);

    /** @type import('../App').default */
    this.app = this.props.app;

    this.onChange = onChange.bind(this);
    this.onRecaptchaChange = onChangeNamedDirect.bind(this, 'recaptcha');
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitCode = this.onSubmitCode.bind(this);

    this.state = {
      recaptcha: null,
      code: null,
      name: null,
      email: null,
      password: null,
      waitForCode: false,
    };
  }

  async onSubmit(e) {
    e.preventDefault();

    await this.app.userRegisterPre(this.state);
    this.setState({waitForCode: true});
  }

  onSubmitCode(e) {
    e.preventDefault();

    this.app.userRegister(this.state);
  }

  render() {
    const s = this.state;

    return <section className="container my-4">
      {!s.waitForCode ? <form className="Maw(500px) Mx(a) shadow p-3 rounded" onSubmit={this.onSubmit}>
        <div className="form-group">
          <label>Username <span className="C($red)">*</span></label>
          <input className="form-control" type="text" required name="name" onChange={this.onChange}/>
          <small className="form-text text-muted">This will be your username.</small>
        </div>
        <div className="form-group">
          <label>Email address <span className="C($red)">*</span></label>
          <input className="form-control" type="email" required name="email" onChange={this.onChange}/>
          <small className="form-text text-muted">We'll never share your email address with anyone else.</small>
        </div>
        <div className="form-group">
          <label>Password <span className="C($red)">*</span></label>
          <input className="form-control" type="password" required name="password" onChange={this.onChange}/>
        </div>
        <div className="form-group">
          <ReCAPTCHA sitekey={this.app.isDevelopment ? TEST_RECAPTCHA_KEY : RECAPTCHA_KEY} onChange={this.onRecaptchaChange}/>
        </div>
        <div className="form-group">
          <small className="form-text text-muted">By clicking “Register” below, you agree to our <Link to="/terms">terms of service</Link> and <Link to="/privacy">privacy policies</Link>.</small>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!this.state.recaptcha}>Register</button>
      </form> : <form className="Maw(500px) Mx(a) shadow p-3 rounded" onSubmit={this.onSubmitCode}>
        <div className="form-group">
          <label>Code <span className="C($red)">*</span></label>
          <input className="form-control" type="text" required name="code" onChange={this.onChange}/>
          <small className="form-text text-muted">We send an email to the address that you provided.</small>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!this.state.code}>Finish</button>
      </form>}
    </section>;
  }
}

export default App;
