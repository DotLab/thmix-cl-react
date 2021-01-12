import React from 'react';
import {Link} from 'react-router-dom';
import QueryString from 'query-string';

import {formatNumber, getTimeSpan, formatTimeSpan, formatNumberShort} from '../utils';
import DefaultAvatar from './DefaultAvatar.jpg';

const MAX_PAGE = 20;
const years = [2021, 2020];

const Row = (s) => (<tr className="Bgc($gray-700) Bgc($gray-600):h mb-1">
  <td className="px-2 py-1 rounded-left">#{formatNumber(s.index)}</td>
  <td className="px-2 py-1 text-left">
    <img className="H(1em) Va(m) rounded" src={s.avatarUrl || DefaultAvatar} alt="avatar"/>
    <Link className="Va(m) Mstart(.25em) text-warning" to={`/users/${s.id}`}>{s.name}</Link>
  </td>
  <td className="px-2 py-1 C($gray-500)">{formatTimeSpan(getTimeSpan(s.playTime))}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.trialCount)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumberShort(s.score)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.avgCombo, 0)}x</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.avgAccuracy * 100, 2)}%</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumberShort(s.score / s.trialCount)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.performance / s.trialCount, 2)}</td>
  <td className="px-2 py-1">{formatNumber(s.performance)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.sCount)}</td>
  <td className="px-2 py-1 C($gray-500)">{formatNumber(s.aCount)}</td>
  <td className="px-2 py-1 C($gray-500) rounded-right">{formatNumber(s.bCount)}</td>
</tr>);

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
    const users = await this.app.userList({page: page, year: 2021});

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
          <div className='Pos(r) Cur(p) text-light d-inline-block text-nowrap mr-3'> {s.year ? s.year : 'all time'}
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
          {!!s.users.length && <div className="table-responsive">
            <table className="Bdcl(s) Bdsp(0,.25em) my-3  text-nowrap text-center">
              <thead className="small">
                <tr>
                  <td></td>
                  <td className="w-100"></td>
                  <td className="px-2 py-1 text-muted">play time</td>
                  <td className="px-2 py-1 text-muted">play count</td>
                  <td className="px-2 py-1 text-muted">scores</td>
                  <td className="px-2 py-1 text-muted">avg. combo</td>
                  <td className="px-2 py-1 text-muted">avg. acc.</td>
                  <td className="px-2 py-1 text-muted">avg. score</td>
                  <td className="px-2 py-1 text-muted">avg. perf.</td>
                  <td className="px-2 py-1">performance</td>
                  <td className="px-2 py-1 text-muted">S</td>
                  <td className="px-2 py-1 text-muted">A</td>
                  <td className="px-2 py-1 text-muted">B</td>
                </tr>
              </thead>
              <tbody>
                {s.users.map((user, i) => <Row {...user} key={i} index={!s.page ? i : s.page * 50 + i}/>)}
              </tbody>
            </table>
          </div>}
          {!!s.users.length && <Pagination page={s.page} />}
        </div>
      </section>
    </div>;
  }
}
