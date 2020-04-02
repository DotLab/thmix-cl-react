import React from 'react';
import DefaultAvatar from './DefaultAvatar.jpg';
import SampleListCover from './SampleListCover.jpg';

import {formatDate, formatNumber, getTimeSpan, getTimeSpanBetween, formatTimeSpan} from '../utils';

const Rank = () => (<div className="Bgc($gray-800) Bgc($gray-700):h Lh(1.15) px-3 rounded mt-1">
  <span className="my-2 badge badge-warning badge-pill">A+</span>
  <div className="d-inline-block my-2 align-middle ml-2">
    <div className="font-italic">Songs Compilation <small>by Foreground Eclipse</small></div>
    <div className="text-warning small">I Won't Say "Farewell"; Someday, We'll Meet Again <span className="C($gray-500)">22 days ago</span></div>
  </div>
  <div className="d-inline-block my-2 align-middle ml-4 ml-md-5">
    <div className="text-warning font-italic font-weight-bold">98.34%</div>
  </div>
  <div className="d-inline-block my-2 align-middle ml-4">
    <div className="font-italic font-weight-bold">453perf</div>
    <div className="small">weighted 100%</div>
  </div>
  <div className="d-inline-block my-2 align-middle ml-4">
    <div className="C(lightgreen) font-weight-bold">453perf</div>
  </div>
</div>);

const Played = () => (<div className="Bgc($gray-800) Bgc($gray-700):h Lh(1.15) pr-3 rounded mt-1">
  <img className="d-inline-block rounded-left" src={SampleListCover} alt=""/>
  <div className="d-inline-block my-2 align-middle ml-2">
    <div><strong>Songs Compilation</strong> <small>by Foreground Eclipse</small></div>
    <div className="C($gray-500) small">mapped by <strong>Kite</strong></div>
  </div>
  <div className="d-inline-block my-2 align-middle ml-4 ml-md-5">
    <div className="text-warning font-weight-bold"><i className="fas fa-play"></i> 345</div>
  </div>
</div>);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.startEdit = this.startEdit.bind(this);

    this.state = {
      id: null,

      name: '',
      email: '',
      salt: '',
      hash: '',
      // meta
      joinedDate: null,
      seenDate: null,
      bio: '',
      avatarUrl: '',
      avatarPath: '',
      // cached
      trialCount: 0,
      score: 0,
      combo: 0,
      accuracy: 0,

      playTime: 0,
      performance: 0,
      ranking: 0,
      sCount: 0,
      aCount: 0,
      bCount: 0,
      cCount: 0,
      dCount: 0,
      fCount: 0,
      bestPerformance: null,
    };
  }

  async componentDidMount() {
    await Promise.all([
      this.app.userGet({id: this.props.match.params.id}),
      this.app.midiBestPerformance(),
    ]).then((value) => {
      this.setState({user: value[0], bestPerformance: value[1]});
    });
  }

  startEdit() {
    this.app.history.push(`/users/${this.app.state.user.id}/edit`);
  }

  render() {
    const s = this.state;
    const isSelf = this.app.state.user && s.id === this.app.state.user.id;

    return <div className="Bgc($black)">
      <section className="Bgc($gray-600) Pt(60px) Pb(20px) px-5 container text-light ">
        <h2 className="m-0 font-weight-normal">
          Player <span className="C(springgreen)">Info</span>
          {isSelf && <span className="C($gray-100) float-right" onClick={this.startEdit}><button className="btn btn-dark"><i className="fas fa-pencil-alt"></i></button></span>}
        </h2>
      </section>
      {/* intro */}
      <section className="Bgc($gray-800) Bdtw(2px) Bdts(s) Bdc(springgreen) py-3 px-5 container text-light">
        <div className="row">
          <div className="col-md-8">
            <img className="H(100px) rounded shadow-sm d-inline-block" src={s.avatarUrl || DefaultAvatar} alt=""/>
            <div className="Lh(1.15) d-inline-block align-middle ml-3">
              <h3 className="h4 mb-1">{s.name}</h3>
              <div>Joined <strong>{formatDate(s.joinedDate)}</strong></div>
              {/* <div>Last seen <strong>{formatDate(s.seenDate)}</strong></div> */}
              <div>Last seen <strong>{formatTimeSpan(getTimeSpanBetween(new Date(), s.seenDate))} ago</strong></div>
            </div>
          </div>
          <div className="col-md-4">
            <table className="w-100">
              <tbody>
                <tr><td>Play Count</td><td className="text-right font-weight-bold">{formatNumber(s.trialCount)}</td></tr>
                <tr><td>Total Scores</td><td className="text-right font-weight-bold">{formatNumber(s.score)}</td></tr>
                <tr><td>Max Combo</td><td className="text-right font-weight-bold">{formatNumber(s.combo)}x</td></tr>
                <tr><td>Accuracy</td><td className="text-right font-weight-bold">{formatNumber(s.accuracy * 100, 2)}%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* rank */}
      <section className="Bgc($gray-900) py-2 px-5 container text-light">
        <div>
          <span className="d-inline-block">
            <div className="Bdc($yellow) Bdts(s) Bdtw(3px) small font-weight-bold">Total Play Time</div>
            <div className="Lh(1)">{formatTimeSpan(getTimeSpan(s.playTime))}</div>
          </span>
          <span className="d-inline-block ml-2">
            <div className="Bdc($gray-100) Bdts(s) Bdtw(3px) small font-weight-bold">Performance</div>
            <div className="Lh(1)">{formatNumber(s.performance)}</div>
          </span>

          <span className="d-inline-block ml-2 ml-lg-5 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) Bgc($purple)! badge badge-pill">S</span></div>
            <div className="Lh(1)">{formatNumber(s.sCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-warning badge-pill">A</span></div>
            <div className="Lh(1)">{formatNumber(s.aCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-light badge-pill">B</span></div>
            <div className="Lh(1)">{formatNumber(s.bCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-info badge-pill">C</span></div>
            <div className="Lh(1)">{formatNumber(s.cCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-danger badge-pill">D</span></div>
            <div className="Lh(1)">{formatNumber(s.dCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-dark badge-pill">F</span></div>
            <div className="Lh(1)">{formatNumber(s.fCount)}</div>
          </span>
        </div>
        {/* graph */}
        <div className="D(tb) w-100">
          <div className="D(tbr)">
            <div className="D(tbc) w-100">None... yet.</div>
            <div className="D(tbc)">
              <span className="d-inline-block ml-2">
                <div className="Bdc($yellow) Bdts(s) Bdtw(3px) font-weight-bold">Ranking</div>
                <div className="Lh(1) Fz(2em) font-weight-light">#{formatNumber(s.ranking)}</div>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="Bdc(springgreen) Bdts(s) Bdtw(2px) mt-2">
        {/* me */}
        <section className="container Bgc($gray-900) mt-2 px-5 py-3 text-light">
          <h3 className="h5"><span className="Bdc(springgreen) Bdbs(s) Bdbw(2px)">me!</span></h3>
          <div className="Whs(pw)">{s.bio}</div>
        </section>
        {/* ranks */}
        <section className="container Bgc($gray-900) mt-2 px-5 py-3 text-light">
          <h3 className="h5"><span className="Bdc(springgreen) Bdbs(s) Bdbw(2px)">Ranks</span></h3>
          <h4 className="h6 mt-3">Best Performances</h4>
          <div>
            No performance records. :(
            <Rank />
            <Rank />
            <Rank />
            <Rank />
          </div>
          <h4 className="h6 mt-3">First Place Ranks <span className="badge badge-pill badge-dark">0</span></h4>
          <div>
            No awesome performance records yet. :(
            <Rank />
            <Rank />
            <Rank />
            <Rank />
          </div>
        </section>
        {/* historical */}
        <section className="container Bgc($gray-900) mt-2 px-5 py-3 text-light">
          <h3 className="h5"><span className="Bdc(springgreen) Bdbs(s) Bdbw(2px)">Historical</span></h3>
          <h4 className="h6 mt-3">Play History</h4>
          <div>None... yet.</div>
          <h4 className="h6 mt-3">Most Played Midis</h4>
          <div>
            No performance records. :(
            <Played />
            <Played />
            <Played />
            <Played />
          </div>
          <h4 className="h6 mt-3">Recent Plays</h4>
          <div>
            No performance records. :(
            <Rank />
            <Rank />
            <Rank />
            <Rank />
          </div>
        </section>
      </div>
    </div>;
  }
}
