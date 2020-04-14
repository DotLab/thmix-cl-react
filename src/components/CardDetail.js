import React from 'react';
import {Link} from 'react-router-dom';
import {onChange, formatNumber, formatDate, onChangeNamedDirect} from '../utils';
import ReCAPTCHA from 'react-google-recaptcha';
import {RECAPTCHA_KEY, TEST_RECAPTCHA_KEY} from '../secrets';

import DefaultAvatar from './DefaultAvatar.jpg';
import attrHaru from './attr-haru.png';
import attrMa from './attr-ma.png';
import attrRei from './attr-rei.png';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-5 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-7 pt-3">{children}</div>);

const levelLimits = {
  n: [1, 20, 40],
  r: [1, 40, 60],
  sr: [1, 60, 80],
  ur: [1, 80, 100],
};

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
        <div><span className="C($gray-600) small">{formatDate(p.date)}</span></div>
      </div>
    </div>
  </div>
</div>);

export default class CardDetail extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.startEdit = this.startEdit.bind(this);
    this.onChange = onChange.bind(this);
    this.onRecaptchaChange = onChangeNamedDirect.bind(this, 'recaptcha');
    this.onPostComment = this.onPostComment.bind(this);
    this.recaptchaRef = React.createRef();
    this.applyLevel = this.applyLevel.bind(this);

    this.state = {
      id: null,

      date: null,
      name: '',
      desc: '',
      url: '',
      rarity: 'n',
      attribute: '',
      spInit: 0,
      spMax: 0,
      haruInit: 0,
      haruMax: 0,
      reiInit: 0,
      reiMax: 0,
      maInit: 0,
      maMax: 0,
      level: 1,
      haru: 1000,
      rei: 1000,
      ma: 1000,
      uploaderName: '',
      comments: [],
    };
  }

  async componentDidMount() {
    const id = this.props.match.params.id;
    const res = await Promise.all([
      this.app.cardGet({id}),
      this.app.genericApi1('ClWebDocCommentList', {docId: id}),
    ]);

    this.setState({...res[0],
      uploaderName: res[0].uploader.name,
      comments: res[1]});

    const haru = this.applyLevel(0);
    const rei = this.applyLevel(0);
    const ma = this.applyLevel(0);
    this.setState({haru, rei, ma});
  }

  startEdit() {
    this.app.history.push(`/cards/${this.state.id}/edit`);
  }

  async onPostComment(e) {
    e.preventDefault();
    const {id, recaptcha, commentText} = this.state;
    if (!commentText) {
      return;
    }

    const comments = await this.app.genericApi1('ClWebDocCommentCreate', {docId: id, recaptcha, text: commentText});
    this.recaptchaRef.current.reset();
    this.setState({
      recaptcha: null, commentText: '',
      comments,
    });
  }

  applyLevel(level) {
    const s = this.state;
    if (level == 0) {
      const haru = s.haruInit / 60;
      const rei = s.reiInit / 60;
      const ma = s.maInit / 60;
      this.setState({haru, rei, ma});
    } else if (level === 1) {
      const t = levelLimits[s.rarity][1] / levelLimits[s.rarity][2];
      const lerp = (init, max) => Math.floor(init + (max - init) * t);
      const haru = lerp(s.haruInit, s.haruMax) / 60;
      const rei = lerp(s.reiInit, s.reiMax) / 60;
      const ma = lerp(s.maInit, s.maMax) / 60;

      this.setState({haru, rei, ma});
    } else {
      const haru = s.haruMax / 60;
      const rei = s.reiMax / 60;
      const ma = s.maMax / 60;
      this.setState({haru, rei, ma});
    }
  }
  render() {
    const s = this.state;

    return <div className="Bgp(c) Bgz(cv)" style={{backgroundImage: `url(${s.coverBlurUrl})`}}>
      <section className="container" style={{backgroundColor: '#ffffffc0'}}>
        {/* desc */}
        <div className="shadow row no-gutters pt-4">
          <div className="col-md-6">
            {/* left */}
            <img className="W(100%)" src={s.url} alt=""/>
          </div>
          <div className="col-md-6 px-4">
            {/* right */}
            <div className="btn-group btn-block">
              <label className={'btn w-100 Bgc(#ff3396):h C(white) C(white):h ' + (s.level === 1 ? 'Bgc(#ff3396)' : 'Bgc(#ff66b0)')} onClick={() => {
                this.setState({level: 1}); this.applyLevel(0);
              }}>level {levelLimits[s.rarity][0]}</label>
              <label className={'btn w-100 Bgc(#ff3396):h C(white) C(white):h ' + (s.level === 40 ? 'Bgc(#ff3396)' : 'Bgc(#ff66b0)')} onClick={() => {
                this.setState({level: 40}); this.applyLevel(1);
              }}>level {levelLimits[s.rarity][1]}</label>
              <label className={'btn w-100 Bgc(#ff3396):h C(white) C(white):h ' + (s.level === 80 ? 'Bgc(#ff3396)' : 'Bgc(#ff66b0)')} onClick={() => {
                this.setState({level: 80}); this.applyLevel(2);
              }}>level {levelLimits[s.rarity][2]}</label>
            </div>
            <div className="row no-gutters mt-3">
              <div className="col-1">
                <img className="mr-2 W(20px)" src={attrHaru} alt=""/>
              </div>
              <div className="col-11 pl-2">
                <div className="row">
                  <div className="col-sm-2 C(#e6006f)">{s.haruInit}</div>
                  <div className="col-sm-10">
                    <div className="progress">
                      <div className="progress-bar Bgc(#e6006f) H(20px)" style={{width: `${s.haru}%`}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row no-gutters mt-3">
              <div className="col-1">
                <img className="mr-2 W(20px)" src={attrRei} alt=""/>
              </div>
              <div className="col-11 pl-2">
                <div className="row">
                  <div className="col-sm-2 C(#20ab53)">{s.haruInit}</div>
                  <div className="col-sm-10">
                    <div className="progress">
                      <div className="progress-bar Bgc(#20ab53) H(20px)" style={{width: `${s.rei}%`}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row no-gutters mt-3">
              <div className="col-1">
                <img className="mr-2 W(20px)" src={attrMa} alt=""/>
              </div>
              <div className="col-11 pl-2">
                <div className="row">
                  <div className="col-sm-2 C(#0098eb)">{s.haruInit}</div>
                  <div className="col-sm-10">
                    <div className="progress">
                      <div className="progress-bar Bgc(#0098eb) H(20px)" style={{width: `${s.ma}%`}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters mt-3">
              <div className="col-1">
                <i class="fas fa-heart"></i>
              </div>
              <div className="col-11 pl-2">
                <div className="row">
                  <div className="col-sm-2">SP</div>
                  <div className="col-sm-10">{s.spInit}</div>
                </div>
              </div>
            </div>
            <table className="table mt-4">
              <tbody>
                <tr>
                  <th>Creator</th>
                  <td>{s.uploaderName}</td>
                  <td><i className="fas fa-pen Cur(p)" onClick={this.startEdit}></i></td>
                </tr>
                <tr>
                  <th>Card</th>
                  <td>
                    <div>{s.rarity}</div>
                    <small>{s.attribute}</small>
                  </td>
                  <td><img className="W(30px)" src={attrHaru} alt=""/></td>
                </tr>
                <tr>
                  <th>Submitted</th>
                  <td>{formatDate(s.date)}</td>
                  <td><i class="fas fa-calendar-alt"></i></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="Bgc($gray-800) pt-2 pb-3">
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
