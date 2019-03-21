import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';

// @ts-ignore
import {albums} from '../json/albums';
// @ts-ignore
import {songs} from '../json/songs';

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
    };
  }

  async componentDidMount() {
    const midi = await this.app.midiGet({id: this.props.match.params.id});
    this.setState(midi);
  }

  updateMeta() {
    const {id, name, desc, artistName, artistUrl} = this.state;
    this.app.midiUpdate({id, name, desc, artistName, artistUrl});
  }

  updateSource() {
    const {id, sourceArtistName, sourceAlbumName, sourceSongName, touhouAlbumIndex, touhouSongIndex} = this.state;
    this.app.midiUpdate({
      id,
      sourceArtistName, sourceAlbumName, sourceSongName,
      touhouAlbumIndex: parseInt(touhouAlbumIndex), touhouSongIndex: parseInt(touhouSongIndex),
    });
  }

  render() {
    const s = this.state;
    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Midi</strong> Detail</h2>
      </section>
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
            <div className="col-sm-9"><input className="form-control" type="text" name="artistName" value={s.artistName} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">midi artist url</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="artistUrl" value={s.artistUrl} onChange={this.onChange}/></div>
          </div>
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
            <label className="col-sm-3 col-form-label text-right">source artist name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="sourceArtistName" value={s.sourceArtistName} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">source album name</label>
            <div className="col-sm-9">
              <select className="form-control" name="touhouAlbumIndex" value={s.touhouAlbumIndex} onChange={this.onChange}>
                {albums.map((x) => <option key={x.album} value={x.album}>{x.tag}: {x.name}</option>)}
              </select>
              {s.touhouAlbumIndex.toString() === '-1' && <input className="form-control mt-3" type="text" name="sourceAlbumName" value={s.sourceAlbumName} onChange={this.onChange}/>}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">source song name</label>
            <div className="col-sm-9">
              {s.touhouAlbumIndex.toString() !== '-1' ? <select className="form-control" name="touhouSongIndex" value={s.touhouSongIndex} onChange={this.onChange} >
                {songs.filter((x) => x.album.toString() === s.touhouAlbumIndex.toString()).map((x) => <option key={x.song} value={x.song}>{x.song}: {x.name}</option>)}
              </select> : <input className="form-control" type="text" name="sourceSongName" value={s.sourceSongName} onChange={this.onChange}/>}
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateSource}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
    </div>;
  }
}
