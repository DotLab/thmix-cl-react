import React from 'react';
import {Link} from 'react-router-dom';

import {avatarIconUrl} from '../utils';

const Row = () => (<tr className="Bgc($gray-700) Bgc($gray-600):h mb-1">
  <td className="px-2 py-1 rounded-left">#1</td>
  <td className="px-2 py-1 text-left"><img className="H(1em) rounded" src={avatarIconUrl} alt="avatar"/> <Link className="text-warning" to="/users/idke">idke</Link></td>
  <td className="px-2 py-1 C($gray-500)">34,234</td>
  <td className="px-2 py-1 C($gray-500)">342.34m</td>
  <td className="px-2 py-1 C($gray-500)">34,342,345x</td>
  <td className="px-2 py-1 C($gray-500)">84%</td>
  <td className="px-2 py-1">12,334</td>
  <td className="px-2 py-1 C($gray-500)">23</td>
  <td className="px-2 py-1 C($gray-500)">644</td>
  <td className="px-2 py-1 C($gray-500) rounded-right">583</td>
</tr>);

const Pagination = () => (<div className="text-center small">
  <span className="Cur(p) mr-4 mr-lg-5 text-muted"><i className="fas fa-angle-double-left"></i></span>
  <span className="Cur(p) mr-4 mr-lg-5 text-muted"><i className="fas fa-angle-left"></i></span>
  <span className="Cur(p) mr-4 mr-lg-5 text-warning">1</span>
  <span className="Cur(p) mr-4 mr-lg-5">2</span>
  <span className="Cur(p) mr-4 mr-lg-5">3</span>
  <span className="Cur(p) mr-4 mr-lg-5">4</span>
  <span className="Cur(p) mr-4 mr-lg-5">5</span>
  <span className="Cur(p) mr-4 mr-lg-5">6</span>
  <span className="Cur(p) mr-4 mr-lg-5">7</span>
  <span className="Cur(p) mr-4 mr-lg-5">8</span>
  <span className="Cur(p) mr-4 mr-lg-5">9</span>
  <span className="Cur(p) mr-4 mr-lg-5"><i className="fas fa-angle-right"></i></span>
  <span className="Cur(p)"><i className="fas fa-angle-double-right"></i></span>
</div>);

export default class RankingListing extends React.Component {
  render() {
    return <div>
      <section className="container">
        <div className="Bgc($gray-900) Py(100px) text-light text-center shadow">
          <h2 className="font-weight-light"><span className="text-warning">Performance</span> Ranking</h2>
        </div>
      </section>
      <section className="container px-md-5 mb-2">
        <div className="Bgc($gray-800) text-light p-3 shadow">
          <Pagination />
          <div className="table-responsive">
            <table className="Bdcl(s) Bdsp(0,.25em) my-3  text-nowrap text-center">
              <thead className="small">
                <tr>
                  <td></td>
                  <td className="w-100"></td>
                  <td className="px-2 py-1 text-muted">play count</td>
                  <td className="px-2 py-1 text-muted">sunshine</td>
                  <td className="px-2 py-1 text-muted">combo</td>
                  <td className="px-2 py-1 text-muted">accuracy</td>
                  <td className="px-2 py-1">performance</td>
                  <td className="px-2 py-1 text-muted">S</td>
                  <td className="px-2 py-1 text-muted">A+</td>
                  <td className="px-2 py-1 text-muted">A</td>
                </tr>
              </thead>
              <tbody>
                <Row/>
                <Row/>
                <Row/>
                <Row/>
                <Row/>
                <Row/>
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
      </section>
    </div>;
  }
}
