import React from 'react';
import {rpc} from '../apiService';
import {Link} from 'react-router-dom';

import {formatNumber, touhouAlbum} from '../utils';
import DefaultAvatar from './DefaultAvatar.jpg';

const Card = (s) => (<div className="mb-2">
  <div className="H(140px) bg-light rounded shadow-sm border">
    <div className="rounded-top p-4">
      <div className="position-relative w-100 h-100">
        <div className="T(0) End(0) Lh(1.15) position-absolute text-right">
          <em>{formatNumber(s.trialCount)}</em> <i className="small fa-fw fas fa-play"></i><br/>
          <em>{formatNumber(s.downloadCount)}</em> <i className="small fa-fw fas fa-download"></i><br/>
          <em>{formatNumber(s.voteSum)}</em> <i className="small fa-fw fas fa-chevron-up"></i><br/>
          <em>{formatNumber(s.loveCount)}</em> <i className="small fa-fw fas fa-heart"></i><br/>
        </div>
        <div className="T(0px) Pend(40px) Start(0) Lh(1.15) Fz(16px) position-absolute font-italic w-100">
          <Link className="h5 m-0 C(black) Td(n)" to={`/midis/${s._id}`}>{s.name}</Link>
          <div>{s.artistName}</div>
          <div className="font-weight-bold text-truncate">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].name : s.sourceAlbumName}</div>
          <div className="Lh(1) font-weight-bold text-truncate">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].songs[s.touhouSongIndex].name : s.sourceSongName}</div>
        </div>
      </div>
    </div>
  </div>
</div>);

const UserRank = (p) => (<div className="rounded border shadow-sm px-3">
  <div className="D(ib) Lh(1) text-center align-middle">
    {p.userRanking !== -1 && <div className="Fz(1.2em) font-weight-bold m-0">#{p.userRanking}</div>}
  </div>
  <div className="D(ib) ml-3">
    <img className="H(60px) my-2 rounded shadow-sm" src={p.userRankingDetail.avatarUrl || DefaultAvatar} alt=""/>
  </div>
  <div className="Mend(10px)--xl Mend(10px)--lg D(ib) ml-2 align-middle">
    <h4 className="h6 m-0 font-italic"><Link className="text-dark" to={'/users/' + p.userRankingDetail.id}>{p.userRankingDetail.name}</Link></h4>
  </div>

  {p.userRanking === -1 ? <div>You have no rank yet</div>:
    <div className="D(ib)">
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">SCORE</div>
        <div className="Fz(1.25em)">{p.userRankingDetail.score}</div>
      </div>
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">AVG ACC</div>
        <div className="Fz(1.25em)">{formatNumber(p.userRankingDetail.avgAccuracy * 100, 2)}%</div>
      </div>
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">PERF</div>
        <div className="Fz(1.25em)">{formatNumber(p.userRankingDetail.performance, 0)}</div>
      </div>
    </div>}
</div>);

const RankRow = (p) => (<tr className="Bgc($gray-200) Bgc($gray-300):h mb-1">
  <td className="px-2 py-1 rounded-left font-weight-bold">#{p.i}</td>
  <td className="px-2 py-1 text-left"><img className="H(20px) rounded" src={p.avatarUrl || DefaultAvatar} alt="avatar"/> <Link className="text-dark" to={'/users/' + p.id}>{p.name}</Link></td>
  <td className="px-2 py-1 C($gray-600)">{formatNumber(p.score)}</td>
  <td className="px-2 py-1 C($gray-600)">{formatNumber(p.avgAccuracy * 100, 2)}%</td>
  <td className="px-2 py-1">{formatNumber(p.performance)}</td>
</tr>);

export default class EventDetail extends React.Component {
    _isMounted = false;
    constructor(props) {
      super(props);

      this.state = {
        id: this.props.match.params.id,

        name: '',
        desc: '',
        startDate: null,
        endDate: null,
        coverUrl: '',
        midis: [],
        rankings: [],
        userRanking: -1,
        userRankingDetail: {},
      };
    }

    async componentDidMount() {
      const ranks = await rpc('ClWebEventRanking', {id: this.props.match.params.id});
      const event = await rpc('ClWebEventGetMidiList', {id: this.props.match.params.id});

      this.setState({...event, ...ranks});
    }

    render() {
      const s = this.state;

      return <section className="container Pb(100px)">
        <div className="Pos(a) Z(-1)" style={{transition: `.4s cubic-bezier(.215,.61,.355,1)`}}>
          <img className="Op(0.7)" src={s.coverUrl} alt=""/>
        </div>
        <div className="Pt(150px) Px(100px)">
          <div className="Bgc(white) C(gray) rounded border shadow-sm p-3 W(40%)">
            <h2 className="h4 Op(1) font-weight-normal mb-0">Event {s.name}</h2>
            <div><small>{new Date(s.startDate).toDateString()} - {new Date(s.endDate).toDateString()}</small></div>
            <div><small>{s.desc}</small></div>
          </div>

          <div className="D(f) Mt(50px) Maw(800px)">
            <div className="W(80%)">
              <div className="Fz(20px) Fw(b) Py(5px)">EVENT SONGS</div>
              {s.midis.map((midi) => <Card {...midi} key={midi._id} />)}
            </div>
            <section className="Mstart(20px) W(60%) pb-3">
              <div className="Fz(20px) Fw(b) Py(5px)">RANKING</div>
              {/* rank */}
              {s.rankings && s.rankings.length ? <div className="container bg-white shadow p-3 mb-3">
                <UserRank userRanking={s.userRanking} userRankingDetail={s.userRankingDetail}/>
                {/* ranking */}
                <div className="table-responsive">
                  <table className="Bdcl(s) Bdsp(0,.25em) text-nowrap text-center">
                    <thead className="small">
                      <tr>
                        <td></td>
                        <td className="w-100"></td>
                        <td className="px-2 py-1 text-muted">score</td>
                        <td className="px-2 py-1 text-muted">avg acc</td>
                        <td className="px-2 py-1">perf</td>
                      </tr>
                    </thead>
                    <tbody>
                      {s.rankings.map((x, i) => <RankRow {...x} i={i} key={i} />)}
                    </tbody>
                  </table>
                </div>
              </div> : <div className="container bg-white shadow p-3 text-center">No scores yet. Maybe you should try setting some?</div>}
            </section>
          </div>
        </div>
      </section>;
    }
}
