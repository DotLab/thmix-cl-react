import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import {onChangeNamedDirect} from '../utils';

import ApiContext from '../ApiContext';

class App extends React.Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.onRecaptchaChange = onChangeNamedDirect.bind(this, 'recaptcha');
    this.state = {
      recaptcha: null,
    };
  }

  render() {
    return <section className="container my-4">
      <form className="Maw(500px) Mx(a) shadow p-3 rounded">
        <div className="form-group">
          <div className="form-group">
            <label>Username <span className="C($red)">*</span></label>
            <input className="form-control" type="text" required/>
            <small className="form-text text-muted">This will be your username.</small>
          </div>
          <label>Email address <span className="C($red)">*</span></label>
          <input className="form-control" type="email" required/>
          <small className="form-text text-muted">We'll never share your email address with anyone else.</small>
        </div>
        <div className="form-group">
          <label>Password <span className="C($red)">*</span></label>
          <input className="form-control" type="password" required/>
        </div>
        <div className="form-group">
          <ReCAPTCHA sitekey="6LfMg5YUAAAAAAJr_ANH5TVvhoSHsJEa6oGSHw6f" name="hi" onChange={this.onRecaptchaChange}/>
        </div>
        <div className="form-group">
          <small className="form-text text-muted">By clicking “Register” below, you agree to our terms of service and privacy statement.</small>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!this.state.recaptcha}>Register</button>
      </form>
    </section>;
  }
}

export default App;
