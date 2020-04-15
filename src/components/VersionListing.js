import React from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import ReactMarkdown from 'react-markdown';
import {formatDate} from '../utils';
import {rpc} from '../apiService';

class VersionRow extends React.Component {
  render() {
    const p = this.props;
    return <div className="container mt-4">
      <div className="row shadow-sm">
        <div className="col-md-3 pb-3">
          <div className="badge badge-pill badge-secondary">{formatDate(p.date)}</div>
          <p>{p.name}</p>
          {p.isLoggedIn ? <a className="btn btn-outline-secondary btn-sm" href={p.url}><i class="fas fa-cloud-download-alt"></i> Download</a> :
          <Link className="btn btn-outline-secondary btn-sm" to="/login"><i class="fas fa-cloud-download-alt"></i> Download</Link>}
        </div>
        <div className="col-md-9">
          {p.path.split('.').pop() === 'ipa' ? <h4><i class="fab fa-fw fa-apple"></i> {p.version} ({p.build})</h4> :
            p.path.split('.').pop() === 'apk' ? <h4><i class="fab fa-fw fa-android"></i> {p.version} ({p.build})</h4> :
            <h4><i class="fas fa-fw fa-question"></i> {p.version} ({p.build})</h4>}

          <ReactMarkdown skipHtml={true} source={p.desc}/>
        </div>
      </div>
    </div>;
  }
}

export default class VersionListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      versions: [],
    };
  }

  async componentDidMount() {
    const {page} = queryString.parse(this.props.location.search);
    const versions = await rpc('ClVersionList', {page});
    this.setState({versions});
  }

  render() {
    const s = this.state;
    const isLoggedIn = this.app.state.user ? true : false;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Versions</h2>
      </section>
      <section className="mt-2 mb-3">
        <div className="">
          <div className="row">
            {s.versions.map((version) => <VersionRow {...version} key={version.id} isLoggedIn={isLoggedIn}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
