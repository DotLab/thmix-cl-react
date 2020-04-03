import React from 'react';

import {onTextareaChange, onChange} from '../utils';
import NoImageAvailable from './NoImageAvailable.jpg';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class PersonDetailEdit extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onTextareaChange = onTextareaChange.bind(this);
    this.updateMeta = this.updateMeta.bind(this);
    this.onCoverChange = this.onCoverChange.bind(this);

    this.state = {
      id: null,

      name: '',
      desc: '',
      url: null,
      avatarPath: null,
      avatarUrl: null,
    };
  }

  async componentDidMount() {
    const person = await this.app.personGet({id: this.props.match.params.id});
    this.setState(person);
  }

  updateMeta() {
    const {id, name, desc, url} = this.state;
    this.app.personUpdate({id, name, desc, url});
  }

  onCoverChange(e) {
    if (!e.target.files[0]) return;

    const size = e.target.files[0].size;
    if (size > 1048576) {
      this.app.error('image too large');
    } else {
      const fr = new FileReader();
      fr.onload = (e) => {
        // @ts-ignore
        const buffer = e.target.result;
        this.app.personUploadAvatar({id: this.state.id, size, buffer}).then((person) => this.setState(person));
      };
      fr.readAsArrayBuffer(e.target.files[0]);
    }
  }

  render() {
    const s = this.state;
    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Person</strong> Detail</h2>
      </section>
      {/* cover */}
      <Block>
        <Block.Left><h2 className="h5 m-0">Avatar</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9">
              <img className="H(256px) shadow-sm rounded" src={s.avatarUrl || NoImageAvailable} alt=""/>
              <input className="D(b) W(a) mt-2 form-control-file" type="file" accept="image/*" onChange={this.onCoverChange}/>
            </div>
          </div>
        </Block.Right>
      </Block>
      <Block>
        <Block.Left><h2 className="h5 m-0">Meta</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">url</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="url" value={s.url} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">description</label>
            <div className="col-sm-9">
              <textarea className="form-control" value={s.desc} name="desc" rows={this.state.descRowCount} onChange={this.onTextareaChange}/>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateMeta}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
    </div>;
  }
}
