import React from 'react';
import {Link} from 'react-router-dom';
import QueryString from 'query-string';
import Card from './Card';

import {onChange, pushHistory} from '../utils';

export default class ResourceListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.query = QueryString.parse(props.location.search);

    this.onChange = onChange.bind(this);
    this.pushHistory = pushHistory.bind(this);

    this.state = {
      query: {},
      resources: [],
      touhouAlbumIndex: '-2',
      touhouSongIndex: '-2',
    };
    this.changeSort = this.changeSort.bind(this);
  }

  getQuery(props) {
    return QueryString.parse(props.location.search);
  }

  async componentDidMount() {
    const query = this.getQuery(this.props);
    // @ts-ignore

    const resources = await this.app.resourceList(query);
    this.setState({query, resources});
  }

  async componentWillReceiveProps(props) {
    const query = this.getQuery(props);
    // @ts-ignore
    const resources = await this.app.resourceList(query);

    this.setState({query, resources});
  }

  changeSort(e) {
    const type = e.target.value;
    this.query.type = type;
    this.setState({query: this.query});
    this.pushHistory();
  }

  render() {
    const s = this.state;

    return <div className="container">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <div className="Mt(40px) row">
          <select className="form-control col-sm-6" name="type" value={s.type} onChange={this.changeSort}>
            <option value="">ANY: Any</option>
            <option value="image">Image</option>
            <option value="sound">Sound</option>
          </select>
        </div>
        <div className="row small mt-3">
          <div className="col-md-2">STATUS</div>
          <div className="col-md-10">
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== undefined ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: undefined})}>Any</Link>
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== 'APPROVED' ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: 'APPROVED'})}>Approved</Link>
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== 'PENDING' ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: 'PENDING'})}>Pending</Link>
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== 'DEAD' ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: 'DEAD'})}>Dead</Link>
          </div>
        </div>
      </section>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100) Px(1.25em) pt-2">
          <div className="row">
            {s.resources.map((resource) => <Card {...resource} key={resource.id} app={this.app}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
