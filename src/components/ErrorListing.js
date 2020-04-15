import React from 'react';
import {formatDate, onChange, deleteFalsyKeys} from '../utils';
import {rpc} from '../apiService';
import queryString from 'query-string';

class ErrorRow extends React.Component {
  render() {
    const p = this.props;
    return <div className="row shadow-sm rounded pt-2 mt-2">
      <div className="col-md-3">
        <div className="badge badge-pill badge-danger">{formatDate(p.date)}</div>
        <pre className="Fz(10px)">
          {[p.version, p.platform, p.runtime, p.source, p.sampleRate, p.bufferSize, p.model, p.name, p.os, p.cpu, p.gpu].join('\n')}
        </pre>
      </div>
      <div className="col-md-9">
        <pre className="Fz(10px)">{p.message}</pre>
        <hr/>
        <pre className="Fz(10px)">{p.stack}</pre>
      </div>
    </div>;
  }
}

export default class ErrorListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onSearch = this.onSearch.bind(this);
    this.onChange = onChange.bind(this);

    this.state = {
      errors: [],
      versionInput: '',
    };
  }

  async componentDidMount() {
    const {page, version} = queryString.parse(this.props.location.search);
    const errors = await rpc('ClErrorList', {page, version});
    this.setState({errors});
  }

  async componentWillReceiveProps(props) {
    const {page, version} = queryString.parse(props.location.search);
    const errors = await rpc('ClErrorList', {page, version});
    this.setState({errors});
  }

  pushQuery(spec) {
    const query = deleteFalsyKeys({...queryString.parse(this.props.location.search), ...spec});
    this.props.history.push(this.props.location.pathname + '?' + queryString.stringify(query));
    return query;
  }

  onSearch(e) {
    e.preventDefault();
    this.pushQuery({version: this.state.versionInput});
  }

  render() {
    const s = this.state;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="Fw(n)">Errors</h2>
        <form onSubmit={this.onSearch} className="input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">version</div>
          </div>
          <input className="form-control" type="text" name="versionInput" value={s.versionInput} onChange={this.onChange}/>
          <div className="input-group-append">
            <button type="submit" className="btn btn-secondary"><i className="fas fa-search"></i></button>
          </div>
        </form>
      </section>
      <section className="container mt-2 mb-3">
        {s.errors.map((error) => <ErrorRow {...error} key={error.id}/>)}
      </section>
    </div>;
  }
}
