import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import {onChange, onChangeNamedDirect, formatDate} from '../utils';
import {RECAPTCHA_KEY, TEST_RECAPTCHA_KEY} from '../secrets';

export default class MidiUpload extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onRecaptchaChange = onChangeNamedDirect.bind(this, 'recaptcha');
    this.sendMessage = this.sendMessage.bind(this);

    this.recaptchaRef = React.createRef();

    this.state = {
      recaptcha: null,
      text: '',
      messages: [],
    };
  }

  async componentDidMount() {
    const messages = await this.app.boardGetMessages();
    this.app.boardRequestMessageUpdate();
    this.setState({messages});

    this.app.socket.on('sv_board_update_message', (message) => {
      this.setState({messages: [message, ...this.state.messages]});
    });
  }

  async componentWillUnmount() {
    this.app.boardStopMessageUpdate();
    this.app.socket.off('sv_board_update_message');
  }

  sendMessage(e) {
    e.preventDefault();
    if (!this.state.text || !this.state.recaptcha) {
      return;
    }

    this.app.boardSendMessage(this.state);
    this.recaptchaRef.current.reset();
    this.setState({recaptcha: null, text: ''});
  }

  render() {
    const s = this.state;

    return <div>
      <section className="Bgc(indigo) container px-4 py-4 shadow text-light">
        <h2 className="h3 m-0 font-weight-light">Board</h2>
      </section>
      <section className="container mt-2 shadow px-4 py-2 text-light">
        <form>
          <div className="D(f)">
            <img className="D(b) mr-2 rounded shadow" width="60" height="60" alt="" src={this.app.state.user && this.app.state.user.avatarUrl}/>
            <div className="W(100%)">
              <div className="mb-2">
                <input className="form-control" type="text" name="text" onChange={this.onChange} value={this.state.text}></input>
              </div>
              <div>
                <button className="btn btn-primary Fl(end)" onClick={this.sendMessage} disabled={!s.text || !s.recaptcha}>Send</button>
                <ReCAPTCHA ref={this.recaptchaRef} sitekey={this.app.isDevelopment ? TEST_RECAPTCHA_KEY : RECAPTCHA_KEY} onChange={this.onRecaptchaChange}/>
              </div>
            </div>
          </div>
        </form>

        {s.messages.map((x) => <div className="D(f) Mt(20px)" key={x._id}>
          <img className="D(b) mr-2 rounded shadow" width="60" height="60" alt="" src={x.userAvatarUrl}/>
          <div className="C(black)">
            <span className="Fw(b) Mend(10px)">{x.userName}</span>
            <span className="C(#999)">{formatDate(x.date)}</span>
            <div>{x.text}</div>
          </div>
        </div>)}
      </section>
    </div>;
  }
}
