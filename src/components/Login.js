import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import {onChangeNamedDirect} from '../utils';

class App extends React.Component {
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
          <label>Email address</label>
          <input className="form-control" type="email" required/>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="form-control" type="password" required/>
        </div>
        {/* <div className="form-group form-check">
            <input type="checkbox" className="form-check-input"/>
            <label className="form-check-label">Remember me</label>
          </div> */}
        <div className="form-group">
          <ReCAPTCHA sitekey="6LfMg5YUAAAAAAJr_ANH5TVvhoSHsJEa6oGSHw6f" name="hi" onChange={this.onRecaptchaChange}/>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!this.state.recaptcha}>Login</button>
      </form>
    </section>;
  }
}

export default App;
