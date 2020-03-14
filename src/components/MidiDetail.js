import React from 'react';
import {Link} from 'react-router-dom';
// import ReCAPTCHA from 'react-google-recaptcha';

import {formatNumber, formatDate, touhouAlbum} from '../utils';

import DefaultAvatar from './DefaultAvatar.jpg';

const Row = () => (<tr className="Bgc($gray-200) Bgc($gray-300):h mb-1">
  <td className="px-2 py-1 rounded-left font-weight-bold">#1</td>
  <td className="px-2 py-1"><span className="badge badge-primary badge-pill">A+</span></td>
  <td className="px-2 py-1 text-left"><img className="H(1em) rounded" src={DefaultAvatar} alt="avatar"/> <Link className="text-dark" to="/users/idke">idke</Link></td>
  <td className="px-2 py-1 C($gray-600)">342,234,444</td>
  <td className="px-2 py-1 C($gray-600)">34,342x</td>
  <td className="px-2 py-1 C($gray-600)">84%</td>
  <td className="px-2 py-1">1,334</td>
  <td className="px-2 py-1 C($gray-600)">23</td>
  <td className="px-2 py-1 C($gray-600)">23</td>
  <td className="px-2 py-1 C($gray-600)">644</td>
  <td className="px-2 py-1 C($gray-600) rounded-right">583</td>
</tr>);

const Reply = () => (<div className="Bdc($gray-400)! border-bottom">
  <div className="Cf Maw(1000px) mx-auto py-2">
    <div className="mt-2">
      <div className="W(10%) float-left pr-3">
        <img className="W(100%) rounded-circle shadow-sm" src={DefaultAvatar} alt=""/>
      </div>
      <div className="W(90%) D(ib)">
        <div>
          <span className="badge badge-pill badge-primary">A+</span> <Link className="font-weight-bold font-italic" to="/users">domSaur</Link>
        </div>
        <div>finally a map for this song ;w;(albeit taco)</div>
        <div><span className="C($gray-600) small">7 days ago</span></div>
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
      trackPlayUrl: '',
      playing: false,
      // meta
      uploadedDate: null,
      approvedDate: null,
      status: 'PENDING',
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
  }

  async componentDidMount() {
    const midi = await this.app.midiGet({id: this.props.match.params.id});
    this.setState(midi);
    const audio = new Audio(this.state.trackPlayUrl);
    audio.addEventListener('loadeddata', () => {
      this.setState({audio});
    });
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

  render() {
    const s = this.state;
    const canEdit = this.app.state.user && this.state.uploaderId === this.app.state.user.id;

    return <div>
      <section className="container">
        {/* hero */}
        <div className="Bgp(c) Bgz(cv) text-light row shadow px-md-4" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, .2), rgba(0, 0, 0, .6)), url(${s.coverBlurUrl})`}}>
          <div className="col-md-8">
            <div className="py-2 py-md-4">
              <div><i className="fa-fw fas fa-play"></i> {formatNumber(s.trialCount)} <i className="fa-fw fas fa-chevron-up"></i> {formatNumber(s.upCount - s.downCount)} <i className="fa-fw fas fa-heart"></i> {formatNumber(s.loveCount)}</div>
              <div className="Lh(1.15) font-italic">
                <div className="D(f) Ai(c) mt-4"><h2 className="h4 m-0 D(ib)">{s.name}</h2>
                  {!s.playing && <span onClick={this.play} className="Mstart(20px) Fz(40px)"><i class="far fa-play-circle"></i></span>}
                  {s.playing && <span onClick={this.play} className="Mstart(20px) Fz(40px)"><i class="fas fa-pause-circle"></i></span>}
                </div>

                <div className="h5 m-0">by <a className="text-light" href={s.artistUrl}>{s.artistName}</a></div>
              </div>
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
          <div className="col-md-4">
            <div className="text-right mt-md-4">
              <span className="Fz(1em) badge badge-pill badge-dark p-3 shadow-sm" style={{backgroundColor: '#00000080'}}>{s.status}</span>
              {canEdit && <span className="Fz(1em) Cur(p) badge badge-pill badge-dark p-3 shadow-sm ml-2" style={{backgroundColor: '#00000080'}} onClick={this.startEdit}><i className="fas fa-pencil-alt"></i></span>}
            </div>
            <div className="mt-4 ml-md-auto px-3 py-2" style={{backgroundColor: '#00000060'}}>
              {/* <div><i className="fa-fw fas fa-star"></i> 4.8</div> */}
              <div><i className="fa-fw fas fa-sun"></i> {formatNumber(s.avgScore)}</div>
              <div><i className="fa-fw fas fa-link"></i> {formatNumber(s.avgCombo)}x</div>
              <div><i className="fa-fw fas fa-bullseye"></i> {formatNumber(s.avgAccuracy * 100)}%</div>
            </div>
            <div className="Mt(2px) ml-md-auto px-3 py-2" style={{backgroundColor: '#00000060'}}>
              <div className="text-center">User Rating</div>
              <div>
                <i className="fa-fw fas fa-angle-up"></i> {formatNumber(s.upCount)} <span className="float-right"><i className="fa-fw fas fa-angle-down"></i> {formatNumber(s.downCount)}</span>
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
            <div className="Bgc($gray-200) ml-md-auto mt-md-3 px-3 py-2 shadow-sm">
              <div className="text-center mt-2">Pass Rate</div>
              <div>
                <i className="fa-fw fas fa-check"></i> {formatNumber(s.passCount)} <div className="float-right"><i className="fa-fw fas fa-times"></i> {formatNumber(s.failCount)}</div>
              </div>
              <div className="text-center mt-2">Grade Cutoff</div>
              <div>
                <div><span className="font-weight-bold">S </span><span className="float-right">{formatNumber(s.sCutoff)}</span></div>
                <div><span className="font-weight-bold">A-</span><span className="float-right">{formatNumber(s.aCutoff)}</span></div>
                <div><span className="font-weight-bold">B-</span><span className="float-right">{formatNumber(s.bCutoff)}</span></div>
                <div><span className="font-weight-bold">C-</span><span className="float-right">{formatNumber(s.cCutoff)}</span></div>
                <div><span className="font-weight-bold">D-</span><span className="float-right">{formatNumber(s.dCutoff)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="Bgc($gray-800) pt-2 pb-3">
        {/* rank */}
        {s.records.length ? <div className="container bg-white shadow p-3 mb-3">
          {/* 1st */}
          <div className="rounded border shadow-sm px-3">
            <div className="D(ib) Lh(1) text-center align-middle">
              <div className="Fz(1.2em) font-weight-bold m-0">#1</div>
              <div className="badge badge-success badge-pill mt-1">A+</div>
            </div>
            <div className="D(ib) ml-3">
              <img className="H(80px) my-2 rounded shadow-sm" src={DefaultAvatar} alt=""/>
            </div>
            <div className="Mend(120px)--xl Mend(20px)--lg D(ib) ml-2 align-middle">
              <h4 className="h6 m-0 font-italic">Alchyr</h4>
              <div className="small">achieved about 2 hour ago</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">TOTAL SUNSHINE</div>
              <div className="Fz(1.25em)">453,432,435</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">MAX COMBO</div>
              <div className="Fz(1.25em)">445x</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">ACCURACY</div>
              <div className="Fz(1.25em)">90.4%</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">PERF</div>
              <div className="Fz(1.25em)">453</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">PERFECT</div>
              <div className="Fz(1em)">453</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">GREAT</div>
              <div className="Fz(1em)">453</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">GOOD</div>
              <div className="Fz(1em)">453</div>
            </div>
            <div className="D(ib) mx-2 my-2 align-middle">
              <div className="Fz(.75em) font-weight-bold border-bottom">MISS</div>
              <div className="Fz(1em)">453</div>
            </div>
          </div>
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
                  <td className="px-2 py-1 text-muted">miss</td>
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
        </div> : <div className="container bg-white shadow p-3 text-center">
          No scores yet. Maybe you should try setting some?
        </div>}
        {/* comments */}
        {/* <div className="container bg-white shadow"> */}
        {/* input */}
        {/* <div className="Cf Maw(1000px) mx-auto py-3">
            <h2 className="C($pink) h5 m-0">Comments <span className="badge badge-secondary badge-pill">3</span></h2>
            <div className="mt-2">
              <div className="W(10%) float-left pr-3">
                <img className="W(100%) rounded-circle shadow-sm" src={DefaultAvatar} alt=""/>
              </div>
              <form className="W(90%) D(ib)">
                <textarea className="form-control" type="text" />
                <ReCAPTCHA className="mt-2 float-left" sitekey="6LfMg5YUAAAAAAJr_ANH5TVvhoSHsJEa6oGSHw6f" name="hi" onChange={this.onRecaptchaChange}/>
                <button className="btn btn-primary mt-2 ml-2" type="submit">Post</button>
              </form>
            </div>
          </div> */}
        {/* </div> */}
        {s.comments.length && <div className="Bgc($gray-200) container">
          <div className="">
            <Reply />
            <Reply />
            <Reply />
            <Reply />
          </div>
        </div>}
      </section>
    </div>;
  }
}
