import React from 'react';
import {Link} from 'react-router-dom';

import {onChange} from '../utils';
import {requestTranslationLang, updateTranslationLang} from '../translationService';
// @ts-ignore
import langs from '../json/langs.json';
import {rpc} from '../apiService';

import EditableText from './EditableText';

class SongRow extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.state = {
      songName0: '',
      songName1: '',
      songName2: '',

      sourceSongName: this.props.sourceSongName,
    };

    this.onChange = onChange.bind(this);
    this.onApplyTranslation = this.onApplyTranslation.bind(this);
  }

  async componentDidMount() {
    const p = this.props;
    if (!p.sourceSongName) return;

    await Promise.all([
      requestTranslationLang(p.lang0, 'name.artifact', p.sourceSongName),
      requestTranslationLang(p.lang1, 'name.artifact', p.sourceSongName),
      requestTranslationLang(p.lang2, 'name.artifact', p.sourceSongName),
    ]).then((value) => {
      this.setState({songName0: value[0], songName1: value[1], songName2: value[2]});
    });
  }

  async onApplyTranslation() {
    const p = this.props;
    const s = this.state;

    if (!p.sourceSongName) {
      this.setState({editing: false});
      return;
    }

    await Promise.all([
      s.editingTranslation0 && updateTranslationLang(p.lang0, p.sourceSongName, 'name.artifact', s.songName0),
      s.editingTranslation1 && updateTranslationLang(p.lang1, p.sourceSongName, 'name.artifact', s.songName1),
      s.editingTranslation2 && updateTranslationLang(p.lang2, p.sourceSongName, 'name.artifact', s.songName2),
    ]);
    this.setState({editingTranslation0: false, editingTranslation1: false, editingTranslation2: false});

    if (!this.state.editing) return;
    this.setState({editing: false});

    if (this.state.sourceSongName === this.props.sourceSongName) return;
    await Promise.all([
      this.props.sourceSongNameChange({midiId: this.props._id, sourceSongName: this.state.sourceSongName}),
      requestTranslationLang(p.lang0, 'name.artifact', s.sourceSongName),
      requestTranslationLang(p.lang1, 'name.artifact', s.sourceSongName),
      requestTranslationLang(p.lang2, 'name.artifact', s.sourceSongName),
    ]).then((value) => {
      this.setState({songName0: value[1], songName1: value[2], songName2: value[3]});
    });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return <tr className="" key={p._id}>
      <td className="W(15%)"></td>
      <td className="W(30%)">
        {!s.editing && <strong onClick={() => this.setState({editing: true})}>{s.sourceSongName || 'No name yet'}</strong>}
        {s.editing && <input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="sourceSongName" value={s.sourceSongName} onChange={this.onChange}/>}
      </td>
      {!s.editingTranslation0 && <td className="Pend(3%) W(20%)"><div onClick={() => this.setState({editingTranslation0: true})}>{s.songName0}</div></td>}
      {s.editingTranslation0 && <td className="Pend(3%) W(20%)"><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="songName0" value={this.state.songName0} onChange={this.onChange}/></td>}

      {!s.editingTranslation1 && <td className="Pend(3%) W(20%)"><div onClick={() => this.setState({editingTranslation1: true})}>{s.songName1}</div></td>}
      {s.editingTranslation1 && <td className="Pend(3%) W(20%)"> <input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="songName1" value={this.state.songName1} onChange={this.onChange}/></td>}

      {!s.editingTranslation2 && <td className="Pend(3%) W(20%)"><div onClick={() => this.setState({editingTranslation2: true})}>{s.songName2}</div></td>}
      {s.editingTranslation2 && <td className="Pend(3%) W(20%)"><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="songName2" value={this.state.songName2} onChange={this.onChange}/></td>}

      <td><button className="btn btn-primary btn-sm" onClick={this.onApplyTranslation}>apply</button></td>
    </tr>;
  }
}

class AlbumRow extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.state = {
      albumTranslation0: '',
      albumTranslation1: '',
      albumTranslation2: '',
      lang0: this.props.lang0,
      lang1: this.props.lang1,
      lang2: this.props.lang2,
      _id: this.props._id,

      sourceAlbumName: this.props.name,
    };

    this.onChange = onChange.bind(this);
    this.sourceSongNameChange = this.sourceSongNameChange.bind(this);
  }

  async componentDidMount() {
    const p = this.props;

    if (!p._id) return;
    await Promise.all([
      requestTranslationLang(p.lang0, 'name.artifact', p.editedAlbumName || p._id),
      requestTranslationLang(p.lang1, 'name.artifact', p.editedAlbumName || p._id),
      requestTranslationLang(p.lang2, 'name.artifact', p.editedAlbumName || p._id),
    ]).then((value) => {
      this.setState({albumTranslation0: value[0], albumTranslation1: value[1], albumTranslation2: value[2]});
    });
  }

  async UNSAFE_componentWillReceiveProps(props) {
    if (!props._id) return;

    if (props.lang0 !== this.state.lang0) {
      const albumTranslation0 = await requestTranslationLang(props.lang0, 'name.artifact', props._id);
      this.setState({updated: true, albumTranslation0});
    }
    if (props.lang1 !== this.state.lang1) {
      const albumTranslation1 = await requestTranslationLang(props.lang1, 'name.artifact', props._id);
      this.setState({updated: true, albumTranslation1});
    }
    if (props.lang2 !== this.state.lang2) {
      const albumTranslation2 = await requestTranslationLang(props.lang2, 'name.artifact', props._id);
      this.setState({updated: true, albumTranslation2});
    }
  }

  updateId(id) {
    this.props.sourceAlbumNameChange(this.props.index, id);
  }

  async updateTranslation0(translation) {
    this.setState({albumTranslation0: translation});
    await updateTranslationLang(this.props.lang0, this.props._id, 'name.artifact', translation);
  }

  async updateTranslation1(translation) {
    this.setState({albumTranslation1: translation});
    await updateTranslationLang(this.props.lang1, this.props._id, 'name.artifact', translation);
  }

  async updateTranslation2(translation) {
    this.setState({albumTranslation2: translation});
    await updateTranslationLang(this.props.lang2, this.props._id, 'name.artifact', translation);
  }

  async sourceSongNameChange({midiId, sourceSongName}) {
    await this.props.sourceSongNameChange({midiId, sourceSongName});
  }

  render() {
    const p = this.props;
    const s = this.state;

    return [
      <tr key={p._id}>
        <EditableText e="td" className="Fw(b):f" text={p.editedAlbumName || p._id} updateText={(id) => this.updateId(id)}/>
        <td></td>
        <EditableText e="td" className="Fw(b):f" text={s.albumTranslation0} updateText={(translation) => this.updateTranslation0(translation)}/>
        <EditableText e="td" className="Fw(b):f" text={s.albumTranslation1} updateText={(translation) => this.updateTranslation1(translation)}/>
        <EditableText e="td" className="Fw(b):f" text={s.albumTranslation2} updateText={(translation) => this.updateTranslation2(translation)}/>

        {/* <td><button className="btn btn-primary btn-sm" onClick={this.onApplyTranslation} disabled={!this.state.updated}>apply</button></td> */}
      </tr>,
      p.songs.map((song, i) => <SongRow {...song} key={song._id} lang0={p.lang0} lang1={p.lang1} lang2={p.lang2} app={this.props.app} sourceSongNameChange={this.sourceSongNameChange}/>),
    ];
  }
}

export default class AlbumListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      albums: [],
      lang0: 'ja',
      lang1: 'zh-CN',
      lang2: 'en',
    };

    this.onLang0Change = this.onLang0Change.bind(this);
    this.onLang1Change = this.onLang1Change.bind(this);
    this.onLang2Change = this.onLang2Change.bind(this);
    this.sourceAlbumNameChange = this.sourceAlbumNameChange.bind(this);
    this.sourceSongNameChange = this.sourceSongNameChange.bind(this);
  }

  onLang0Change(e) {
    const lang0 = e.target.value;
    this.setState({lang0});
  }

  onLang1Change(e) {
    const lang1 = e.target.value;
    this.setState({lang1});
  }

  onLang2Change(e) {
    const lang2 = e.target.value;
    this.setState({lang2});
  }

  async componentDidMount() {
    const albums = await rpc('ClWebMidiCustomizedAlbumList', {});
    this.setState({albums});
  }

  async sourceAlbumNameChange(index, sourceAlbumName) {
    const albums = this.state.albums.slice();
    albums.splice(index, 1, {...albums[index], _id: sourceAlbumName});
    this.setState({albums});
    const midiIds = [];
    albums[index].songs.forEach((x) => x.midiIds.forEach((y) => midiIds.push(y)));
    await Promise.all([
      midiIds.forEach((x) => this.app.midiUpdate({id: x, sourceAlbumName})),
    ]);
  }

  async sourceSongNameChange({midiId, sourceSongName}) {
    await this.app.midiUpdate({id: midiId, sourceSongName});
  }

  render() {
    const s = this.state;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Songs <Link to='/songs'><button className="mx-3 btn btn-warning">System songs</button></Link></h2>
      </section>

      <table className="table table-responsive">
        <thead>
          <tr>
            <th>Album</th>
            <th>Song</th>
            <th> Name <select className="Bdrs(5px) W(90px)" onChange={this.onLang0Change} value={s.lang0}>
              {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
            </th>

            <th> Name <select className="Bdrs(5px) W(90px)" onChange={this.onLang1Change} value={s.lang1}>
              {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
            </th>

            <th> Name <select className="Bdrs(5px) W(90px)" onChange={this.onLang2Change} value={s.lang2}>
              {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
            </th>
            <th className="W(5%)">action on translation</th>
          </tr>
        </thead>
        <tbody>
          {s.albums.map((album, i) => <AlbumRow key={album._id} {...album} lang1={s.lang1} lang2={s.lang2} lang0={s.lang0} app={this.app}
            sourceAlbumNameChange={this.sourceAlbumNameChange} sourceSongNameChange={this.sourceSongNameChange} index={i}/>)}
        </tbody>
      </table>
    </div>;
  }
}
