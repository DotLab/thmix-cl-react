import React from 'react';
import {rpc} from '../apiService';
import {Link} from 'react-router-dom';

import {formatNumber, formatTimeSpan, formatNumberShort, getTimeSpan, touhouAlbum} from '../utils';
import DefaultAvatar from './DefaultAvatar.jpg';
import {RankTable} from './UserRank';

const Card = (s) => (<div className="mb-2">
  <div className="H(120px) rounded shadow-sm Bgp(c) Bgz(cv)" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, .8)), url(${s.coverUrl})`, transition: `.4s cubic-bezier(.215,.61,.355,1)`}}>
    <div className="rounded-top py-3 px-4">

      <div className="position-relative" >
        <div className="T(0) End(0) Lh(1.15) position-absolute text-right">
          <em>{formatNumber(s.trialCount)}</em> <i className="small fa-fw fas fa-play"></i><br/>
          <em>{formatNumber(s.downloadCount)}</em> <i className="small fa-fw fas fa-download"></i><br/>
          <em>{formatNumber(s.voteSum)}</em> <i className="small fa-fw fas fa-chevron-up"></i><br/>
          <em>{formatNumber(s.loveCount)}</em> <i className="small fa-fw fas fa-heart"></i><br/>
        </div>
        <div className="T(0px) Pend(40px) Start(0) Lh(1.15) Fz(16px) position-absolute font-italic w-100">
          <Link className="h5 m-0 C(white) Td(n)" to={`/midis/${s._id}`}>{s.name}</Link>
          <div>{s.artistName}</div>
          <div className="font-weight-bold text-truncate">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].name : s.sourceAlbumName}</div>
          <div className="Lh(1) font-weight-bold text-truncate">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].songs[s.touhouSongIndex].name : s.sourceSongName}</div>
        </div>
      </div>
    </div>
  </div>
</div>);

const UserRank = (p) => (<div className="shadow-sm px-3">
  <div className="D(ib) Lh(1) text-center align-middle">
    {p.userRanking !== -1 && <div className="Fz(1.2em) font-weight-bold m-0">#{p.userRanking}</div>}
  </div>
  <div className="D(ib) ml-3">
    <img className="H(60px) my-2 rounded shadow-sm" src={p.userRankingDetail.avatarUrl || DefaultAvatar} alt=""/>
  </div>
  <div className="Mend(10px)--xl Mend(10px)--lg D(ib) ml-2 align-middle">
    <h4 className="h6 m-0 font-italic"><Link className="text-light" to={'/users/' + p.userRankingDetail.id}>{p.userRankingDetail.name}</Link></h4>
  </div>

  {p.userRanking === -1 ? <div>You have no rank yet</div>:
    <div className="D(ib)">
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">PERF</div>
        <div className="Fz(1.25em)">{formatNumber(p.userRankingDetail.performance, 0)}</div>
      </div>
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">PLAY TIME</div>
        <div className="Fz(1.25em)">{formatTimeSpan(getTimeSpan(p.userRankingDetail.playTime))}</div>
      </div>
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">PLAY COUNT</div>
        <div className="Fz(1.25em)">{formatNumber(p.userRankingDetail.trialCount)}</div>
      </div>
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">SUNSHINE</div>
        <div className="Fz(1.25em)">{formatNumberShort(p.userRankingDetail.score)}</div>
      </div>
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">AVG COMBO</div>
        <div className="Fz(1.25em)">{formatNumber(p.userRankingDetail.avgCombo)}x</div>
      </div>
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">AVG ACC</div>
        <div className="Fz(1.25em)">{formatNumberShort(p.userRankingDetail.avgAccuracy * 100, 2)}%</div>
      </div>
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">AVG SCORE</div>
        <div className="Fz(1.25em)">{formatNumberShort(p.userRankingDetail.score / p.userRankingDetail.trialCount, 2)}</div>
      </div>
      <div className="D(ib) mx-2 my-2 align-middle">
        <div className="Fz(.75em) font-weight-bold border-bottom">AVG PEFF</div>
        <div className="Fz(1.25em)">{formatNumberShort(p.userRankingDetail.performance / p.userRankingDetail.trialCount, 2)}</div>
      </div>
    </div>}
</div>);

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

      return <section className="Pos(r) Pb(100px) Bgc(#1e2129)">
        <div className="Pos(a) Z(0) W(100%)" style={{transition: `.4s cubic-bezier(.215,.61,.355,1)`}}>
          <img className="W(100%) Brightness(0.5)" src={s.coverUrl} alt=""/>
        </div>
        <div className="Pos(a) B(0) W(100%) H(50%)"style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .6))`}}></div>

        <div className="Pos(r) Pt(280px) Px(100px) C(white)">
          <h1 className="Op(1) font-weight-normal mb-0">Event {s.name}</h1>
          <div className="C(white) Fz(18px)">{new Date(s.startDate).toDateString()} - {new Date(s.endDate).toDateString()}</div>
          <div className="C(white) Fz(18px)">{s.desc}</div>
          <div className="D(f) Mt(50px)">
            <div className="W(40%)">
              <div className="Fz(20px) Fw(b) Py(5px)">EVENT SONGS</div>
              {s.midis.map((midi) => <Card {...midi} key={midi._id} />)}
            </div>
            <section className="Mstart(20px) W(60%) pb-3">
              <div className="Fz(20px) Fw(b) Py(5px)">RANKING</div>
              {/* rank */}
              {s.rankings && s.rankings.length ? <div className="container Bgc(#292d38) rounded shadow p-3 mb-3">
                <UserRank userRanking={s.userRanking} userRankingDetail={s.userRankingDetail}/>
                <RankTable users={s.rankings}/>
              </div> : <div className="container Bgc(#292d38) rounded shadow p-3 text-center">No scores yet. Maybe you should try setting some?</div>}
            </section>
          </div>
        </div>
      </section>;
    }
}
