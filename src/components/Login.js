import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {Translation as Tr} from '../translationService';

import {onChange, onChangeNamedDirect} from '../utils';
import {RECAPTCHA_KEY, TEST_RECAPTCHA_KEY} from '../secrets';

class App extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onRecaptchaChange = onChangeNamedDirect.bind(this, 'recaptcha');
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      recaptcha: null,
    };
  }

  onSubmit(e) {
    e.preventDefault();

    this.app.userLogin(this.state);
  }

  render() {
    return <section className="container my-4">
      <form className="Maw(500px) Mx(a) shadow p-3 rounded" onSubmit={this.onSubmit}>
        <div className="form-group">
          <label><Tr src="Email address"/></label>
          <input className="form-control" type="email" required name="email" onChange={this.onChange}/>
        </div>
        <div className="form-group">
          <label><Tr src="Password"/></label>
          <input className="form-control" type="password" required name="password" onChange={this.onChange}/>
        </div>
        {/* <div className="form-group form-check">
            <input type="checkbox" className="form-check-input"/>
            <label className="form-check-label">Remember me</label>
          </div> */}
        <div className="form-group">
          <ReCAPTCHA sitekey={this.app.isDevelopment ? TEST_RECAPTCHA_KEY : RECAPTCHA_KEY} onChange={this.onRecaptchaChange}/>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!this.state.recaptcha}><Tr src="Login"/></button>
      </form>
    </section>;
  }
}

export default App;
