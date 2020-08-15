import React from 'react';
import {Link} from 'react-router-dom';

import {onChange} from '../utils';
import {requestTranslationNS} from '../translationService';
// @ts-ignore
import langs from '../json/langs.json';
import {rpc} from '../apiService';

class SongRow extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.state = {
      songName0: '',
      songName1: '',
      songName2: '',
      editing: false,
      editingTranslation0: false,
      editingTranslation1: false,
      editingTranslation2: false,
      sourceSongName: this.props.sourceSongName,
    };
    this._isMounted = false;

    this.onChange = onChange.bind(this);
    this.onApplyTranslation = this.onApplyTranslation.bind(this);
  }

  async componentDidMount() {
    const p = this.props;
    this._isMounted = true;
    if (!p.sourceSongName) return;

    await Promise.all([
      requestTranslationNS(p.lang0, p.sourceSongName),
      requestTranslationNS(p.lang1, p.sourceSongName),
      requestTranslationNS(p.lang2, p.sourceSongName),
    ]).then((value) => {
      if (this._isMounted) {
        this.setState({songName0: value[0], songName1: value[1], songName2: value[2]});
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async onApplyTranslation() {
    const p = this.props;
    const s = this.state;

    if (!p.sourceSongName) return;

    await Promise.all([
      p.app.translationUpdate({src: p.sourceSongName, lang: p.lang0, namespace: 'ns', text: s.songName0}),
      p.app.translationUpdate({src: p.sourceSongName, lang: p.lang1, namespace: 'ns', text: s.songName1}),
      p.app.translationUpdate({src: p.sourceSongName, lang: p.lang2, namespace: 'ns', text: s.songName2}),
    ]);
    this.setState({editingTranslation0: false, editingTranslation1: false, editingTranslation2: false});

    if (!this.state.editing || this.state.sourceSongName === this.props.sourceSongName) return;
    this.setState({editing: false});

    await Promise.all([
      this.props.sourceSongNameChange({midiId: this.props._id, sourceSongName: this.state.sourceSongName}),
      requestTranslationNS(p.lang0, s.sourceSongName),
      requestTranslationNS(p.lang1, s.sourceSongName),
      requestTranslationNS(p.lang2, s.sourceSongName),
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
      {!s.editingTranslation0 && <td><div onClick={() => this.setState({editingTranslation0: true})}>{s.songName0}</div></td>}
      {s.editingTranslation0 && <td><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="songName0" value={this.state.songName0} onChange={this.onChange}/></td>}

      {!s.editingTranslation1 && <td><div onClick={() => this.setState({editingTranslation1: true})}>{s.songName1}</div></td>}
      {s.editingTranslation1 && <td> <input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="songName1" value={this.state.songName1} onChange={this.onChange}/></td>}

      {!s.editingTranslation2 && <td><div onClick={() => this.setState({editingTranslation2: true})}>{s.songName2}</div></td>}
      {s.editingTranslation2 && <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="songName2" value={this.state.songName2} onChange={this.onChange}/></td>}

      <td><button className="btn btn-primary btn-sm" onClick={this.onApplyTranslation}>apply</button></td>
    </tr>;
  }
}

class AlbumRow extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.state = {
      albumName0: '',
      albumName1: '',
      albumName2: '',
      editing: false,
      editingTranslation0: false,
      editingTranslation1: false,
      editingTranslation2: false,

      sourceAlbumName: this.props.name,
    };
    this._isMounted = false;

    this.onChange = onChange.bind(this);
    this.onApplyTranslation = this.onApplyTranslation.bind(this);
    this.sourceSongNameChange = this.sourceSongNameChange.bind(this);
  }

  async componentDidMount() {
    const p = this.props;
    this._isMounted = true;

    if (!p.name) return;
    await Promise.all([
      requestTranslationNS(p.lang0, p.name),
      requestTranslationNS(p.lang1, p.name),
      requestTranslationNS(p.lang2, p.name),
    ]).then((value) => {
      if (this._isMounted) {
        this.setState({albumName0: value[0], albumName1: value[1], albumName2: value[2]});
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async onApplyTranslation() {
    const p = this.props;
    const s = this.state;
    if (!p.name) return;

    await Promise.all([
      p.app.translationUpdate({src: p.name, lang: p.lang0, namespace: 'ns', text: s.albumName0}),
      p.app.translationUpdate({src: p.name, lang: p.lang1, namespace: 'ns', text: s.albumName1}),
      p.app.translationUpdate({src: p.name, lang: p.lang2, namespace: 'ns', text: s.albumName2}),
    ]);
    this.setState({editingTranslation0: false, editingTranslation1: false, editingTranslation2: false});

    if (!this.state.editing || this.state.sourceAlbumName === this.props.name) return;
    this.setState({editing: false});
    await Promise.all([
      this.props.albumMidis.forEach((x) => this.props.sourceAlbumNameChange({midiId: x, sourceAlbumName: this.state.sourceAlbumName})),
    ]);

    await Promise.all([
      requestTranslationNS(p.lang0, s.sourceAlbumName),
      requestTranslationNS(p.lang1, s.sourceAlbumName),
      requestTranslationNS(p.lang2, s.sourceAlbumName),
    ]).then((value) => {
      if (this._isMounted) {
        this.setState({albumName0: value[0], albumName1: value[1], albumName2: value[2]});
      }
    });
  }

  async sourceSongNameChange({midiId, sourceSongName}) {
    await this.props.sourceSongNameChange({midiId, sourceSongName});
  }

  render() {
    const p = this.props;
    const s = this.state;

    return <div className="Mb(30px) D(f)">
      <table className="P(10px) W(100%)">
        <tbody>
          <tr>
            <td className="W(15%) Va(t)">
              {!s.editing && <div onClick={() => this.setState({editing: true})}>{s.sourceAlbumName || 'No name yet'}</div>}
              {s.editing && <input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="sourceAlbumName" value={s.sourceAlbumName} onChange={this.onChange}/>}
            </td>
            <td className="W(30%)"></td>
            {!s.editingTranslation0 && <td ><div onClick={() => this.setState({editingTranslation0: true})}>{s.albumName0}</div></td>}
            {s.editingTranslation0 && <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="albumName0" value={s.albumName0} onChange={this.onChange}/></td>}

            {!s.editingTranslation1 && <td><div onClick={() => this.setState({editingTranslation1: true})}>{s.albumName1}</div></td>}
            {s.editingTranslation1 && <td> <input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="albumName1" value={s.albumName1} onChange={this.onChange}/></td>}

            {!s.editingTranslation2 && <td><div onClick={() => this.setState({editingTranslation2: true})}>{s.albumName2}</div></td>}
            {s.editingTranslation2 && <td><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="albumName2" value={s.albumName2} onChange={this.onChange}/></td>}

            <td><button className="btn btn-primary btn-sm" onClick={this.onApplyTranslation}>apply</button></td>
          </tr>
          {p.songs.map((song, i) => <SongRow {...song} key={i} lang0={p.lang0} lang1={p.lang1} lang2={p.lang2} app={this.props.app} sourceSongNameChange={this.sourceSongNameChange}/>)}
        </tbody>
      </table>
    </div>;
  }
}

export default class AlbumListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      albums: [],
      albumSystem: [],
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

  onLang1Change(e) {
    const lang1 = e.target.value;
    this.setState({lang1});
  }

  onLang2Change(e) {
    const lang2 = e.target.value;
    this.setState({lang2});
  }

  onLang0Change(e) {
    const lang0 = e.target.value;
    this.setState({lang0});
  }

  async componentDidMount() {
    const albums = await rpc('ClWebMidiAlbumList', {});
    this.setState({albums});
  }

  async sourceAlbumNameChange({midiId, sourceAlbumName}) {
    await this.app.midiUpdate({id: midiId, sourceAlbumName});
  }

  async sourceSongNameChange({midiId, sourceSongName}) {
    await this.app.midiUpdate({id: midiId, sourceSongName});
  }

  render() {
    const s = this.state;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Songs</h2>
      </section>
      <Link to='/songs'><button className="btn btn-outline-secondary">System songs</button></Link>
      <table className="table">
        <thead>
          <tr>
            <th className="W(15%)">Album</th>
            <th className="W(30%)">Song</th>
            <th> Name <select className="Bdrs(5px) W(80px)" onChange={this.onLang0Change} value={s.lang0}>
              {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
            </th>

            <th> Name <select className="Bdrs(5px) W(80px)" onChange={this.onLang1Change} value={s.lang1}>
              {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
            </th>

            <th> Name <select className="Bdrs(5px) W(80px)" onChange={this.onLang2Change} value={s.lang2}>
              {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
            </th>
            <th className="W(5%)">action on translation</th>
          </tr>
        </thead>
      </table>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100)">
          <div className="Mx(10px) Pt(10px)">
            {s.albums.map((album) => <AlbumRow {...album} key={album._id} lang1={s.lang1} lang2={s.lang2} lang0={s.lang0} app={this.app}
              sourceAlbumNameChange={this.sourceAlbumNameChange} sourceSongNameChange={this.sourceSongNameChange}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
