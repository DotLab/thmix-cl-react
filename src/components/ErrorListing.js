import React from 'react';
import {formatDate} from '../utils';
import {rpc} from '../apiService';

class ErrorRow extends React.Component {
  render() {
    const p = this.props;
    return <div className="container mt-4">
      <div className="row shadow-sm">
        <div className="col-md-3 pb-3">
          <div className="badge badge-pill badge-secondary">{formatDate(p.date)}</div>
          <pre className="Fz(10px)">
            {[p.version, p.platform, p.runtime, p.source, p.sampleRate, p.bufferSize, p.model, p.name, p.os, p.cpu, p.gpu].join('\n')}
          </pre>
        </div>
        <div className="col-md-9">
          <pre className="Fz(10px)">{p.message}</pre>
          <hr/>
          <pre className="Fz(10px)">{p.stack}</pre>
        </div>
      </div>
    </div>;
  }
}

export default class ErrorListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      errors: [],
    };
  }

  async componentDidMount() {
    const errors = await rpc('ClErrorList', {});
    this.setState({errors});
  }

  render() {
    const s = this.state;
    const isLoggedIn = this.app.state.user ? true : false;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Errors</h2>
      </section>
      <section className="mt-2 mb-3">
        <div className="">
          <div className="row">
            {s.errors.map((error) => <ErrorRow {...error} key={error.id} isLoggedIn={isLoggedIn}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
