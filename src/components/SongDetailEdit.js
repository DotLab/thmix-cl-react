import React from 'react';

import {onTextareaChange, onChange} from '../utils';
import {requestTranslation} from '../translationService';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class SongDetailEdit extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onTextareaChange = onTextareaChange.bind(this);
    this.updateMeta = this.updateMeta.bind(this);

    this.state = {
      id: null,

      albumId: null,
      composerId: null,
      name: '',
      nameI18n: '',
      desc: '',
      track: null,
      descRowCount: 5,
    };
  }

  async componentDidMount() {
    const song = await this.app.songGet({id: this.props.match.params.id});
    const nameI18n = await requestTranslation('name.artifact', song.name);
    this.setState({...song, nameI18n});
  }

  updateMeta() {
    const {id, albumId, composerId, name, nameI18n, desc, track} = this.state;
    this.app.songUpdate({id, albumId, composerId, name, nameI18n, desc, track});
  }

  render() {
    const s = this.state;
    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Song</strong> Detail</h2>
      </section>
      <Block>
        <Block.Left><h2 className="h5 m-0">Meta</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">album ID</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="albumId" value={s.albumId} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">composer ID</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="composerId" value={s.composerId} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">song name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">translated name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="nameI18n" value={s.nameI18n} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">song description</label>
            <div className="col-sm-9">
              <textarea className="form-control" value={s.desc} name="desc" rows={this.state.descRowCount} onChange={this.onTextareaChange}/>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">track number</label>
            <div className="col-sm-9"><input className="form-control" type="number" name="track" value={s.track} onChange={this.onChange}/></div>
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
