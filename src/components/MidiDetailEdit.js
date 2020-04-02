import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';
import NoImageAvailable from './NoImageAvailable.jpg';

const INVALID = '-1';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class MidiDetailEdit extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onTextareaChange = onTextareaChange.bind(this);
    this.onCheckboxChange = onCheckboxChange.bind(this);
    this.updateMeta = this.updateMeta.bind(this);
    this.updateSource = this.updateSource.bind(this);
    this.onCoverChange = this.onCoverChange.bind(this);
    this.changeAlbum = this.changeAlbum.bind(this);
    this.changeSong = this.changeSong.bind(this);
    this.changeAuthor = this.changeAuthor.bind(this);

    this.state = {
      id: null,

      name: '',
      desc: '',
      descRowCount: 5,
      artistName: '',
      artistUrl: '',

      sourceArtistName: '',
      sourceAlbumName: '',
      sourceSongName: '',
      touhouAlbumIndex: '-1',
      touhouSongIndex: '-1',

      albums: [],
      albumId: '',
      songs: [],
      songId: '',
      authors: [],
      authorId: '',
    };
  }

  async componentDidMount() {
    await Promise.all([
      this.app.midiGet({id: this.props.match.params.id}),
      this.app.albumList(),
      this.app.authorList(),
    ]).then((value) => {
      this.setState({albums: value[1], authors: value[2]});
      this.setState(value[0]);
    });
  }

  updateMeta() {
    const {id, name, desc, artistName, artistUrl, authorId} = this.state;
    this.app.midiUpdate({id, name, desc, artistName, artistUrl, authorId});
  }

  updateSource() {
    const {id, sourceArtistName, sourceAlbumName, sourceSongName, albumId, songId} = this.state;
    this.app.midiUpdate({
      id,
      sourceArtistName, sourceAlbumName, sourceSongName,
      albumId, songId,
    });
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
        this.app.midiUploadCover({id: this.state.id, size, buffer}).then((midi) => this.setState(midi));
      };
      fr.readAsArrayBuffer(e.target.files[0]);
    }
  }

  async changeAlbum(e) {
    if (e.target.value === INVALID) {
      this.setState({albumId: null, sourceAlbumName: '', sourceSongName: ''});
      return;
    }
    this.setState({albumId: e.target.value});
    await Promise.all([
      this.app.albumGet({id: e.target.value}),
      this.app.songList({albumId: e.target.value}),
    ]).then((value) => {
      this.setState({sourceAlbumName: value[0].name, songs: value[1]});
    });
  }

  async changeSong(e) {
    this.setState({songId: e.target.value});
    const sourceSong = await this.app.songGet({id: e.target.value});
    this.setState({sourceSongName: sourceSong.name});
  }

  async changeAuthor(e) {
    if (e.target.value === INVALID) {
      this.setState({authorId: null, artistName: '', artistUrl: ''});
      return;
    }
    this.setState({authorId: e.target.value});
    const author = await this.app.personGet({id: e.target.value});
    this.setState({artistName: author.name, artistUrl: author.url});
  }

  render() {
    const s = this.state;
    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Midi</strong> Detail</h2>
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
            <label className="col-sm-3 col-form-label text-right">midi name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">midi description</label>
            <div className="col-sm-9">
              <textarea className="form-control" value={s.desc} name="desc" rows={this.state.descRowCount} onChange={this.onTextareaChange}/>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">midi artist name</label>
            <div className="col-sm-9">
              <select className="form-control" name="artistName" value={s.authorId} onChange={this.changeAuthor}>
                <option value={INVALID}>not yet included</option>
                {s.authors.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
              {!s.authorId && <input className="form-control mt-3" type="text" name="artistName" value={s.artistName} onChange={this.onChange}/>}
            </div>
            {/* <div className="col-sm-9"><input className="form-control" type="text" name="artistName" value={s.artistName} onChange={this.onChange}/></div> */}
          </div>
          {!s.authorId && <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">midi artist url</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="artistUrl" value={s.artistUrl} onChange={this.onChange}/></div>
          </div>}
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateMeta}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
      <Block>
        <Block.Left><h2 className="h5 m-0">Source</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">source album name</label>
            <div className="col-sm-9">
              <select className="form-control" name="sourceAlbumName" value={s.albumId} onChange={this.changeAlbum}>
                <option value={INVALID}>not yet included</option>
                {s.albums.map((x) => <option key={x.id} value={x.id}>{x.abbr}: {x.name}</option>)}
              </select>
              {!s.albumId && <input className="form-control mt-3" type="text" name="sourceAlbumName" value={s.sourceAlbumName} onChange={this.onChange}/>}
            </div>
          </div>
          {s.albumId && <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">source song name</label>
            <div className="col-sm-9">
              <select className="form-control" name="sourceSongName" value={s.songId} onChange={this.changeSong} >
                <option value={INVALID}>---</option>
                {s.songs.map((x) => <option key={x._id} value={x._id}>{x.track}: {x.name}</option>)}
              </select>
            </div>
          </div>}
          {!s.albumId && <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">source song name</label>
            <div className="col-sm-9">
              <input className="form-control" type="text" name="sourceSongName" value={s.sourceSongName} onChange={this.onChange}/>
            </div>
          </div>}
          {!s.albumId && <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">source artist name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="sourceArtistName" value={s.sourceArtistName} onChange={this.onChange}/></div>
          </div>}
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateSource}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
    </div>;
  }
}
