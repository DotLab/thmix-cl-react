import React from 'react';
import {Link} from 'react-router-dom';
import QueryString from 'query-string';

import {Translation as Tr} from '../translationService';
import {UserRankTable} from './UserRankTable';

const MAX_PAGE = 20;
const years = [2021, 2020];

const Pagination = (s) => {
  const page = s.page;

  const pages = [];
  const pageStart = Math.max(0, page - 4);
  const pageEnd = Math.min(pageStart + 8, MAX_PAGE);
  for (let i = pageStart; i <= pageEnd; i++) pages.push(i);

  const canGoBack = page > 0;
  const canGoForward = page < MAX_PAGE;

  /* eslint-disable no-multi-spaces*/
  return <div className="text-center small">
    {canGoBack &&     <Link className="text-light mr-4 mr-lg-5"                                                 to={'/users?' + QueryString.stringify({page: 0})}>       <i className="fas fa-angle-double-left"></i></Link>}
    {canGoBack &&     <Link className="text-light mr-4 mr-lg-5"                                                 to={'/users?' + QueryString.stringify({page: page - 1})}><i className="fas fa-angle-left"></i></Link>}
    {pages.map((p) => <Link className={'mr-4 mr-lg-5' + (p === page ? ' text-warning' : ' text-light')} key={p} to={'/users?' + QueryString.stringify({page: p})}>       {p}</Link>)}
    {canGoForward &&  <Link className="text-light mr-4 mr-lg-5"                                                 to={'/users?' + QueryString.stringify({page: page + 1})}><i className="fas fa-angle-right"></i></Link>}
    {canGoForward &&  <Link className="text-light"                                                              to={'/users?' + QueryString.stringify({page: MAX_PAGE})}><i className="fas fa-angle-double-right"></i></Link>}
  </div>;
  /* eslint-enable no-multi-spaces*/
};

export default class RankingListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      users: [],
      year: 2021,
    };
    this.changeYear = this.changeYear.bind(this);
  }

  getPage(props) {
    const query = QueryString.parse(props.location.search);
    // @ts-ignore
    let page = parseInt(query.page);
    if (!(page > 0)) page = 0;

    return page;
  }

  async componentDidMount() {
    const page = this.getPage(this.props);
    const users = await this.app.userList({page: page, year: new Date().getFullYear()});

    this.setState({page, users});
  }

  async componentWillReceiveProps(props) {
    const page = this.getPage(props);
    const users = await this.app.userList({page: page, year: this.state.year});

    this.setState({page, users});
  }

  async changeYear(e) {
    const year = e.target.value;
    const users = await this.app.userList({page: 0, year});
    this.setState({users, year});
  }

  render() {
    const s = this.state;

    return <div>
      <section className="container">
        <div className="Bgc($gray-900) Py(100px) text-light text-center shadow">
          <h2 className="font-weight-light"><span className="text-warning">Performance</span> Ranking</h2>
          <div className='Pos(r) Cur(p) text-light d-inline-block text-nowrap mr-3'> {s.year ? s.year : <Tr src="All time" />}
            <select className="form-control Pos(a) T(0) Cur(p) H(20px) Start(0) W(80px) Op(0)" name="year" value={s.year ? s.year : 'all time'} onChange={this.changeYear}>
              <option value="">all time</option>
              {years.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </div>
      </section>
      <section className="container px-md-5 mb-2">
        <div className="Bgc($gray-800) text-light p-3 shadow">
          <Pagination page={s.page} />
          {!!s.users.length && <UserRankTable users={s.users} page={s.page}/>}
          {!!s.users.length && <Pagination page={s.page} />}
        </div>
      </section>
    </div>;
  }
}
