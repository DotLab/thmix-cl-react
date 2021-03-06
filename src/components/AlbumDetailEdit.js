import React from 'react';

import {onTextareaChange, onChange} from '../utils';
import {requestTranslation} from '../translationService';
import NoImageAvailable from './NoImageAvailable.jpg';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class AlbumDetailEdit extends React.Component {
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
      nameI18n: '',
      category: '',
      desc: '',
      date: null,
      coverPath: '',
      coverUrl: null,
      coverBlurPath: '',
      coverBlurUrl: '',
      descRowCount: 5,
    };
  }

  async componentDidMount() {
    const album = await this.app.albumGet({id: this.props.match.params.id});
    const nameI18n = await requestTranslation('name.artifact', album.name);
    this.setState({...album, nameI18n});
  }

  updateMeta() {
    const {id, name, nameI18n, desc, category} = this.state;
    this.app.albumUpdate({id, name, nameI18n, desc, category});
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
        this.app.albumUploadCover({id: this.state.id, size, buffer}).then((album) => this.setState(album));
      };
      fr.readAsArrayBuffer(e.target.files[0]);
    }
  }

  render() {
    const s = this.state;
    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Album</strong> Detail</h2>
      </section>
      {/* cover */}
      <Block>
        <Block.Left><h2 className="h5 m-0">Cover</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9">
              <img className="H(256px) shadow-sm rounded" src={s.coverUrl || NoImageAvailable} alt=""/>
              <img className="H(128px) shadow-sm rounded ml-2" src={s.coverBlurUrl} alt=""/>
              <input className="D(b) W(a) mt-2 form-control-file" type="file" accept="image/*" onChange={this.onCoverChange}/>
            </div>
          </div>
        </Block.Right>
      </Block>
      <Block>
        <Block.Left><h2 className="h5 m-0">Meta</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">album name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">translated name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="nameI18n" value={s.nameI18n} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">category</label>
            <div className="col-sm-9">
              <select className="form-control" name="category" value={s.category} onChange={this.onChange}>
                <option value="">none</option>
                <option value="touhou">touhou</option>
                <option value="anime">anime</option>
                <option value="game">game</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">album description</label>
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
