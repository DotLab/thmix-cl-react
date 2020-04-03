import React from 'react';
import {Link} from 'react-router-dom';
// import ReCAPTCHA from 'react-google-recaptcha';

import {formatNumber, formatDate} from '../utils';

import DefaultAvatar from './DefaultAvatar.jpg';

export default class SoundfontDetail extends React.Component {
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
      // meta
      uploadedDate: null,
      approvedDate: null,
      status: 'PENDING',

      // cached
      upCount: 0,
      downCount: 0,
      loveCount: 0,
    };
  }

  async componentDidMount() {
    const soundfont = await this.app.soundfontGet({id: this.props.match.params.id});
    this.setState(soundfont);
  }

  startEdit() {
    this.app.history.push(`/soundfonts/${this.state.id}/edit`);
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
              <div><i className="fa-fw fas fa-chevron-up"></i> {formatNumber(s.upCount - s.downCount)} <i className="fa-fw fas fa-heart"></i> {formatNumber(s.loveCount)}</div>
              <div className="Lh(1.15) font-italic">
                <h2 className="h4 m-0 mt-4 ">{s.name}</h2>
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
            <div className="Mt(100px) ml-md-auto px-3 py-2" style={{backgroundColor: '#00000060'}}>
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
            </div>
          </div>
        </div>
      </section>

    </div>;
  }
}
