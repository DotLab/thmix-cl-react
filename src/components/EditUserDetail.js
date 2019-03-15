import React from 'react';

import {onTextareaChange, onChange} from '../utils';
import DefaultAvatar from './DefaultAvatar.jpg';

export default class EditUserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    // const canEdit = this.app.state.user && this.app.state.user.id === props.match.params.userId;
    // if (!canEdit) this.app.history.replace(`/users/${props.match.params.userId}`);

    this.onTextareaChange = onTextareaChange.bind(this);
    this.onChange = onChange.bind(this);
    this.updateBio = this.updateBio.bind(this);
    this.onAvatarChange = this.onAvatarChange.bind(this);


    this.state = {
      name: '',
      bio: '',
      avatarUrl: '',
      bioRowCount: 5,
    };
  }

  componentDidMount() {
    this.setState(this.app.state.user);
  }

  componentWillReceiveProps() {
    this.setState(this.app.state.user);
  }

  updateBio() {
    this.app.userUpdateBio(this.state);
  }

  onAvatarChange(e) {
    if (!e.target.files[0]) return;

    const size = e.target.files[0].size;
    if (size > 1048576) {
      this.app.error('image too large');
    } else {
      const fr = new FileReader();
      fr.onload = (e) => {
        // @ts-ignore
        const buffer = e.target.result;
        this.app.userUploadAvatar({size, buffer});
      };
      fr.readAsArrayBuffer(e.target.files[0]);
    }
  }

  render() {
    const s = this.state;

    return <div>
      <section className="container p-0">
        <div className="Bgc($gray-900) Pt(50px) px-5 pb-4 text-light shadow">
          <h2 className="font-weight-light m-0"><span className="font-weight-normal">Account</span> Settings</h2>
        </div>
      </section>
      {/* profile */}
      <section className="container px-md-5 mb-2">
        <div className="row text-light">
          <div className="Bgc($gray-700) shadow col-lg-3 py-3 px-4"><h2 className="h5 m-0">Profile</h2></div>
          <div className="Bgc($gray-600) shadow col-lg-9 pt-3">
            <div className="form-group row">
              <label className="col-sm-2 col-form-label text-right">username</label>
              <div className="col-sm-10"><input className="form-control" type="text" value={s.name} disabled/></div>
            </div>
            <hr/>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label text-right">bio</label>
              <div className="col-sm-10"><textarea className="form-control" value={s.bio} name="bio" rows={this.state.bioRowCount} onChange={this.onTextareaChange}/></div>
            </div>
            <div className="form-group text-right">
              <button className="btn btn-primary" onClick={this.updateBio}>Update Bio</button>
            </div>
          </div>
        </div>
      </section>
      {/* avatar */}
      <section className="container px-md-5 mb-2">
        <div className="row text-light">
          <div className="Bgc($gray-700) shadow col-lg-3 py-3 px-4"><h2 className="h5 m-0">Avatar</h2></div>
          <div className="Bgc($gray-600) shadow col-lg-9 pt-3">
            <div className="form-group row">
              <div className="offset-sm-2 col-sm-10">
                <img className="H(120px) shadow-sm rounded" src={s.avatarUrl || DefaultAvatar} alt=""/>
                {this.app.supportFileUpload && <input className="D(b) W(a) mt-2 form-control-file" type="file" accept="image/*" onChange={this.onAvatarChange}/>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
  }
}
