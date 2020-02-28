import React from 'react';

import {onTextareaChange, onChange} from '../utils';
import DefaultAvatar from './DefaultAvatar.jpg';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class EditUserDetail extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    if (!this.app.isDevelopment) {
      const canEdit = this.app.state.user && this.app.state.user.id === props.match.params.id;
      if (!canEdit) this.app.history.replace(`/users/${props.match.params.id}`);
    }

    this.onChange = onChange.bind(this);
    this.updateBio = this.updateBio.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.onAvatarChange = this.onAvatarChange.bind(this);
    this.onTextareaChange = onTextareaChange.bind(this);

    this.state = {
      name: '',

      bio: '',
      bioRowCount: 5,

      avatarUrl: '',

      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
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

  updatePassword() {
    if (this.state.newPassword && this.state.newPassword === this.state.newPasswordConfirm) {
      this.setState({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      });

      this.app.userUpdatePassword(this.state);
    }
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
      <Block>
        <Block.Left><h2 className="h5 m-0">Profile</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">username</label>
            <div className="col-sm-9"><input className="form-control" type="text" value={s.name} disabled/></div>
          </div>
        </Block.Right>
      </Block>
      {/* avatar */}
      <Block>
        <Block.Left><h2 className="h5 m-0">Avatar</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9">
              <img className="H(120px) shadow-sm rounded" src={s.avatarUrl || DefaultAvatar} alt=""/>
              <input className="D(b) W(a) mt-2 form-control-file" type="file" accept="image/*" onChange={this.onAvatarChange}/>
            </div>
          </div>
        </Block.Right>
      </Block>
      {/* bio */}
      <Block>
        <Block.Left><h2 className="h5 m-0">Bio</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9">
              <textarea className="form-control" value={s.bio} name="bio" rows={this.state.bioRowCount} onChange={this.onTextareaChange}/>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateBio}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
      {/* password */}
      <Block>
        <Block.Left><h2 className="h5 m-0">Password</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">current password</label>
            <div className="col-sm-9"><input className="form-control" type="password" name="currentPassword" value={s.currentPassword} onChange={this.onChange} required/></div>
          </div>
          <hr/>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">new password</label>
            <div className="col-sm-9"><input className="form-control" type="password" name="newPassword" value={s.newPassword} onChange={this.onChange} required/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">password confirm</label>
            <div className="col-sm-9"><input className="form-control" type="password" name="newPasswordConfirm" value={s.newPasswordConfirm} onChange={this.onChange} required/></div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updatePassword}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
    </div>;
  }
}
