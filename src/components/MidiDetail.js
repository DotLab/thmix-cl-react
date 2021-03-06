import React from 'react';
import {Link} from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import {RECAPTCHA_KEY, TEST_RECAPTCHA_KEY} from '../secrets';
import {GradeBadge} from './gradeBadges';
import {rpc} from '../apiService';

import {formatNumber, formatDate, formatDateTime, touhouAlbum, onChange, onChangeNamedDirect} from '../utils';

import DefaultAvatar from './DefaultAvatar.jpg';

const FirstRank = (p) => (<div className="rounded border shadow-sm px-3">
  <div className="D(ib) Lh(1) text-center align-middle">
    <div className="Fz(1.2em) font-weight-bold m-0">#0</div>
    <div className="mt-1"><GradeBadge gradeLevel={p.gradeLevel} grade={p.grade}/></div>
  </div>
  <div className="D(ib) ml-3">
    <img className="H(80px) my-2 rounded shadow-sm" src={p.userAvatarUrl || DefaultAvatar} alt=""/>
  </div>
  <div className="Mend(120px)--xl Mend(20px)--lg D(ib) ml-2 align-middle">
    <h4 className="h6 m-0 font-italic">{p.userName}</h4>
    <div className="small">achieved {formatDate(p.date)}</div>
  </div>
  <div className="D(ib) mx-2 my-2 align-middle">
    <div className="Fz(.75em) font-weight-bold border-bottom">TOTAL SUNSHINE</div>
    <div className="Fz(1.25em)">{formatNumber(p.score)}</div>
  </div>
  <div className="D(ib) mx-2 my-2 align-middle">
    <div className="Fz(.75em) font-weight-bold border-bottom">MAX COMBO</div>
    <div className="Fz(1.25em)">{formatNumber(p.combo)}x</div>
  </div>
  <div className="D(ib) mx-2 my-2 align-middle">
    <div className="Fz(.75em) font-weight-bold border-bottom">ACCURACY</div>
    <div className="Fz(1.25em)">{formatNumber(p.accuracy * 100, 2)}%</div>
  </div>
  <div className="D(ib) mx-2 my-2 align-middle">
    <div className="Fz(.75em) font-weight-bold border-bottom">PERF</div>
    <div className="Fz(1.25em)">{formatNumber(p.performance, 0)}</div>
  </div>
  <div className="D(ib) mx-2 my-2 align-middle">
    <div className="Fz(.75em) font-weight-bold border-bottom">PERFECT</div>
    <div className="Fz(1em)">{formatNumber(p.perfectCount)}</div>
  </div>
  <div className="D(ib) mx-2 my-2 align-middle">
    <div className="Fz(.75em) font-weight-bold border-bottom">GREAT</div>
    <div className="Fz(1em)">{formatNumber(p.greatCount)}</div>
  </div>
  <div className="D(ib) mx-2 my-2 align-middle">
    <div className="Fz(.75em) font-weight-bold border-bottom">GOOD</div>
    <div className="Fz(1em)">{formatNumber(p.goodCount)}</div>
  </div>
  <div className="D(ib) mx-2 my-2 align-middle">
    <div className="Fz(.75em) font-weight-bold border-bottom">BAD</div>
    <div className="Fz(1em)">{formatNumber(p.badCount)}</div>
  </div>
  <div className="D(ib) mx-2 my-2 align-middle">
    <div className="Fz(.75em) font-weight-bold border-bottom">MISS</div>
    <div className="Fz(1em)">{formatNumber(p.missCount)}</div>
  </div>
</div>);

const RankRow = (p) => (<tr className="Bgc($gray-200) Bgc($gray-300):h mb-1">
  <td className="px-2 py-1 rounded-left font-weight-bold">#{p.i}</td>
  <td className="px-2 py-1"><GradeBadge gradeLevel={p.gradeLevel} grade={p.grade}/></td>
  <td className="px-2 py-1 text-left"><img className="H(20px) rounded" src={p.userAvatarUrl || DefaultAvatar} alt="avatar"/> <Link className="text-dark" to={'/users/' + p.userId}>{p.userName}</Link></td>
  <td className="px-2 py-1 C($gray-600)">{formatNumber(p.score)}</td>
  <td className="px-2 py-1 C($gray-600)">{formatNumber(p.combo)}x</td>
  <td className="px-2 py-1 C($gray-600)">{formatNumber(p.accuracy * 100, 2)}%</td>
  <td className="px-2 py-1">{formatNumber(p.performance)}</td>
  <td className="px-2 py-1 C($gray-600)">{formatNumber(p.perfectCount)}</td>
  <td className="px-2 py-1 C($gray-600)">{formatNumber(p.greatCount)}</td>
  <td className="px-2 py-1 C($gray-600)">{formatNumber(p.goodCount)}</td>
  <td className="px-2 py-1 C($gray-600)">{formatNumber(p.badCount)}</td>
  <td className="px-2 py-1 C($gray-600) rounded-right">{formatNumber(p.missCount)}</td>
</tr>);

const Reply = (p) => (<div className="Bdc($gray-400)! border-bottom">
  <div className="Cf Maw(1000px) mx-auto py-2">
    <div className="mt-2">
      <div className="W(10%) float-left pr-3">
        <img className="W(100%) rounded-circle shadow-sm" src={p.userAvatarUrl || DefaultAvatar} alt=""/>
      </div>
      <div className="W(90%) D(ib)">
        <div>
          {/* <span className="badge badge-pill badge-primary">A+</span> */}
          <Link className="font-weight-bold font-italic" to="/users">{p.userName}</Link>
        </div>
        <div>{p.text}</div>
        <div><span className="C($gray-600) small">{formatDateTime(p.date)}</span></div>
      </div>
    </div>
  </div>
</div>);

export default class MidiDetail extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.startEdit = this.startEdit.bind(this);
    this.onChange = onChange.bind(this);
    this.onRecaptchaChange = onChangeNamedDirect.bind(this, 'recaptcha');
    this.onPostComment = this.onPostComment.bind(this);
    this.recaptchaRef = React.createRef();

    this.state = {
      id: null,

      uploaderId: null,
      uploaderName: '',
      uploaderAvatarUrl: '',

      name: '',
      desc: '',
      hash: '',
      path: '',
      artistName: '',
      artistUrl: '',
      audio: null,
      mp3Url: '',
      playing: false,
      // meta
      derivedFromId: null,
      supersedeId: null,
      supersededById: null,

      derivedMidi: null,
      supersedeMidi: null,

      uploadedDate: null,
      approvedDate: null,
      status: '',
      // source
      sourceArtistName: '',
      sourceAlbumName: '',
      sourceSongName: '',

      touhouAlbumIndex: -1,
      touhouSongIndex: -1,
      // comments
      comments: [],
      // cached
      records: [],

      trialCount: 0,
      upCount: 0,
      downCount: 0,
      loveCount: 0,

      avgScore: 0,
      avgCombo: 0,
      avgAccuracy: 0,

      passCount: 0,
      failCount: 0,

      sCutoff: 0,
      aCutoff: 0,
      bCutoff: 0,
      cCutoff: 0,
      dCutoff: 0,
    };

    this.play = this.play.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  async componentDidMount() {
    const id = this.props.match.params.id;

    const res = await Promise.all([
      this.app.midiGet({id}),
      this.app.genericApi1('cl_web_midi_record_list', {id}),
      this.app.genericApi1('ClWebDocCommentList', {docId: id}),
    ]);

    this.setState({
      ...res[0],
      records: res[1],
      comments: res[2],
    });

    if (res[0].mp3Url) {
      const audio = new Audio(res[0].mp3Url);
      audio.addEventListener('loadeddata', () => {
        this.setState({audio});
      });
    }

    const derivedFromId = this.state.derivedFromId;
    const supersedeId = this.state.supersedeId;

    if (derivedFromId) {
      const derivedMidi = await this.app.midiGet({id: derivedFromId});
      this.setState({derivedMidi});
    }
    if (supersedeId) {
      const supersedeMidi = await this.app.midiGet({id: supersedeId});
      this.setState({supersedeMidi});
    }
  }

  componentWillUnmount() {
    if (this.state.audio) {
      this.state.audio.pause();
      this.setState({audio: null});
    }
  }

  startEdit() {
    this.app.history.push(`/midis/${this.state.id}/edit`);
  }

  async play() {
    if (!this.state.audio) {
      return;
    }

    if (!this.state.playing) {
      this.state.audio.play();
    } else {
      this.state.audio.pause();
    }
    const playing = !(this.state.playing);
    this.setState({playing});
  }

  async onPostComment(e) {
    e.preventDefault();
    const {_id, recaptcha, commentText} = this.state;
    if (!commentText) {
      return;
    }
    const comments = await this.app.genericApi1('ClWebDocCommentCreate', {docId: _id, recaptcha, text: commentText});
    this.recaptchaRef.current.reset();
    this.setState({
      recaptcha: null, commentText: '',
      comments,
    });
  }

  async changeStatus(e) {
    const status = e.target.value;
    await rpc('ClWebMidiChangeStatus', {id: this.state.id, status});
    this.setState({status});
  }

  render() {
    const s = this.state;

    return <div className="Bgp(c) Bgz(cv)" style={{backgroundImage: `url(${s.coverBlurUrl})`}}>
      <section className="container" style={{backgroundColor: '#ffffffc0'}}>
        {/* hero */}
        <div className="Bgp(c) Bgz(cv) text-light row shadow px-md-4" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, .2), rgba(0, 0, 0, .6)), url(${s.coverBlurUrl})`}}>
          <div className="col-md-8">
            <div className="py-2 py-md-4">
              <div className="Fz(20px)">
                <i className="fa-fw fas fa-play"></i> {formatNumber(s.trialCount)}&nbsp;
                <i className="fa-fw fas fa-download"></i> {formatNumber(s.downloadCount)}&nbsp;
                <i className="fa-fw fas fa-chevron-up"></i> {formatNumber(s.upCount - s.downCount)}&nbsp;
                <i className="fa-fw fas fa-heart"></i> {formatNumber(s.loveCount)}&nbsp;
              </div>
              <div className="Lh(1.15) font-italic">

                <div className="D(f) Ai(c)">
                  <h2 className="h4 m-0 D(ib)">{s.name}</h2>
                  {!s.playing && <span onClick={this.play} className="Mstart(20px) Fz(40px)"><i className="far fa-play-circle"></i></span>}
                  {s.playing && <span onClick={this.play} className="Mstart(20px) Fz(40px)"><i className="fas fa-pause-circle"></i></span>}
                </div>

                <div className="h5 m-0">by <a className="text-light" href={s.artistUrl}>{s.artistName}</a></div>
                {s.derivedMidi && <div className="h5 my-0 Lh(1.15) mt-3 Fw(n)">derived from <Link className="text-light Fw(b)" to={`/midis/${s.derivedMidi.id}`}>{s.derivedMidi.name}</Link> by <span className="Fw(b)">{s.derivedMidi.artistName}</span></div>}
                {s.supersedeMidi && <div className="h5 my-0 Lh(1.15) Fw(n)">supersede <Link className="text-light Fw(b)" to={`/midis/${s.supersedeMidi.id}`}>{s.supersedeMidi.name}</Link> by <span className="Fw(b)">{s.supersedeMidi.artistName}</span></div>}
              </div>
              <div className="D(f) Fxf(w)">
                {s.author && <div className="Cf mt-4 mr-5">
                  <img className="H(60px) rounded float-left" src={s.author.avatarUrl || DefaultAvatar} alt=""/>
                  <div className="D(ib) Lh(1.15) ml-2 small">
                    <div className="mb-2"><span className="text-light">{s.author.name}</span></div>
                  </div>
                </div>}
                <div className="Cf mt-4">
                  <img className="H(60px) rounded float-left" src={s.uploaderAvatarUrl || DefaultAvatar} alt=""/>
                  <div className="D(ib) Lh(1.15) ml-2 small">
                    <div className="mb-2"><Link className="text-light" to={`/users/${s.uploaderId}`}>{s.uploaderName}</Link></div>
                    <div>uploaded on <strong>{formatDate(s.uploadedDate)}</strong></div>
                    {s.approvedDate && <div>approved on <strong>{formatDate(s.approvedDate)}</strong></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-right mt-md-4">
              <div className="Pos(r) Fz(1em) badge badge-pill badge-dark p-3 shadow-sm" style={{backgroundColor: '#00000080'}}>{s.status}
                <select className="form-control Pos(a) T(0) Cur(p) H(52px) Start(0) W(110px) Op(0)" name="status" value={s.status} onChange={this.changeStatus}>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="INCLUDED">INCLUDED</option>
                  <option value="DEAD">DEAD</option>
                </select>
              </div>
              {s.canEdit && <span className="Fz(1em) Cur(p) badge badge-pill badge-dark p-3 shadow-sm ml-2" style={{backgroundColor: '#00000080'}} onClick={this.startEdit}><i className="fas fa-pencil-alt"></i></span>}
            </div>
            <div className="mt-4 ml-md-auto px-3 py-2" style={{backgroundColor: '#00000060'}}>
              {/* <div><i className="fa-fw fas fa-star"></i> 4.8</div> */}
              <div><i className="fa-fw fas fa-sun"></i> {formatNumber(s.avgScore, 0)}</div>
              <div><i className="fa-fw fas fa-link"></i> {formatNumber(s.avgCombo, 0)}x</div>
              <div><i className="fa-fw fas fa-bullseye"></i> {formatNumber(s.avgAccuracy * 100, 2)}%</div>
            </div>
            <div className="Mt(2px) ml-md-auto px-3 py-2" style={{backgroundColor: '#00000060'}}>
              <div className="text-center">User Rating</div>
              <div>
                <i className="fa-fw fas fa-angle-up"></i> {formatNumber(s.upCount)} ({formatNumber(s.upCount / s.voteCount * 100, 2)}%)
                <span className="float-right"><i className="fa-fw fas fa-angle-down"></i> {formatNumber(s.downCount)}  ({formatNumber(s.downCount / s.voteCount * 100, 2)}%)</span>
              </div>
            </div>
          </div>
        </div>
        {/* desc */}
        <div className="shadow row px-md-4 mb-2">
          <div className="col-md-8">
            {/* left */}
            <div className="row py-2">
              <div className="col-lg-8 py-2">
                <h3 className="h6 m-0">Description</h3>
                <div className="Whs(pw) small">{s.desc}</div>
              </div>
              <div className="col-lg-4 py-2">
                <h3 className="h6 m-0">Source Artist</h3>
                <div className="small"><Link to="/midis">{s.sourceArtistName}</Link></div>
                <h3 className="h6 m-0 mt-3">Source Album</h3>
                <div className="small"><Link to="/midis">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].name : s.sourceAlbumName}</Link></div>
                <h3 className="h6 m-0 mt-3">Source Song</h3>
                <div className="small"><Link to="/midis">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].songs[s.touhouSongIndex].name : s.sourceSongName}</Link></div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            {/* right */}
            <div className="ml-md-auto mt-md-3 px-3 py-2 shadow-sm" style={{backgroundColor: '#ffffff80'}}>
              <div className="text-center mt-2">Pass Rate</div>
              <div>
                <i className="fa-fw fas fa-check"></i> {formatNumber(s.passCount)}  ({formatNumber(s.passCount / s.trialCount * 100, 2)}%)
                <div className="float-right"><i className="fa-fw fas fa-times"></i> {formatNumber(s.failCount)}  ({formatNumber(s.failCount / s.trialCount * 100, 2)}%)</div>
              </div>
              <div className="text-center mt-2">Grade Status</div>
              <div>
                <div><span className="font-weight-bold">S</span><span className="float-right">{formatNumber(s.sCount)} ({formatNumber(s.sCount / s.trialCount * 100, 2)}%)</span></div>
                <div><span className="font-weight-bold">A</span><span className="float-right">{formatNumber(s.aCount)} ({formatNumber(s.aCount / s.trialCount * 100, 2)}%)</span></div>
                <div><span className="font-weight-bold">B</span><span className="float-right">{formatNumber(s.bCount)} ({formatNumber(s.bCount / s.trialCount * 100, 2)}%)</span></div>
                <div><span className="font-weight-bold">C</span><span className="float-right">{formatNumber(s.cCount)} ({formatNumber(s.cCount / s.trialCount * 100, 2)}%)</span></div>
                <div><span className="font-weight-bold">D</span><span className="float-right">{formatNumber(s.dCount)} ({formatNumber(s.dCount / s.trialCount * 100, 2)}%)</span></div>
                <div><span className="font-weight-bold">F</span><span className="float-right">{formatNumber(s.fCount)} ({formatNumber(s.fCount / s.trialCount * 100, 2)}%)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="Bgc($gray-800) pt-2 pb-3">
        {/* rank */}
        {s.records && s.records.length ? <div className="container bg-white shadow p-3 mb-3">
          {/* 1st */}
          <FirstRank {...s.records[0]} />
          {/* ranking */}
          <div className="table-responsive">
            <table className="Bdcl(s) Bdsp(0,.25em) text-nowrap text-center">
              <thead className="small">
                <tr>
                  <td></td>
                  <td></td>
                  <td className="w-100"></td>
                  <td className="px-2 py-1 text-muted">sunshine</td>
                  <td className="px-2 py-1 text-muted">combo</td>
                  <td className="px-2 py-1 text-muted">accuracy</td>
                  <td className="px-2 py-1">performance</td>
                  <td className="px-2 py-1 text-muted">perfect</td>
                  <td className="px-2 py-1 text-muted">great</td>
                  <td className="px-2 py-1 text-muted">good</td>
                  <td className="px-2 py-1 text-muted">bad</td>
                  <td className="px-2 py-1 text-muted">miss</td>
                </tr>
              </thead>
              <tbody>
                {s.records.map((x, i) => <RankRow {...x} i={i} key={i} />)}
              </tbody>
            </table>
          </div>
        </div> : <div className="container bg-white shadow p-3 text-center">
          No scores yet. Maybe you should try setting some?
        </div>}
        {/* comments */}
        <div className="container bg-white shadow">
          {/* input */}
          <div className="Cf Maw(1000px) mx-auto py-3">
            <h2 className="C($pink) h5 m-0">Comments <span className="badge badge-secondary badge-pill">{formatNumber(this.state.comments?.length)}</span></h2>
            <div className="mt-2">
              <div className="W(10%) float-left pr-3">
                <img className="W(100%) rounded-circle shadow-sm" src={this.app.state.user?.avatarUrl || DefaultAvatar} alt=""/>
              </div>
              <form className="W(90%) D(ib)">
                <textarea className="form-control" name="commentText" value={this.state.commentText} onChange={this.onChange} />
                <ReCAPTCHA ref={this.recaptchaRef} className="mt-2 float-left" sitekey={this.app.isDevelopment ? TEST_RECAPTCHA_KEY : RECAPTCHA_KEY} onChange={this.onRecaptchaChange}/>
                <button className="btn btn-primary mt-2 ml-2" type="submit" onClick={this.onPostComment} disabled={!this.state.recaptcha || !this.state.commentText}>Post</button>
              </form>
            </div>
          </div>
        </div>
        {s.comments.length && <div className="Bgc($gray-200) container">
          <div className="">
            {s.comments.map((x) => <Reply {...x} key={x._id}/>)}
          </div>
        </div>}
      </section>
    </div>;
  }
}
