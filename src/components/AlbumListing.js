import React from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';

import {onChange} from '../utils';
import {requestTranslationNS} from '../translationService';
// @ts-ignore
import langs from '../json/langs.json';


class SongRow extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.state = {
      songName0: '',
      songName1: '',
      songName2: '',
    };

    this.onChange = onChange.bind(this);
    this.onApplyTranslation = this.onApplyTranslation.bind(this);
  }

  async componentDidMount() {
    const p = this.props;
    await Promise.all([
      requestTranslationNS(p.lang0, p.name),
      requestTranslationNS(p.lang1, p.name),
      requestTranslationNS(p.lang2, p.name),
    ]).then((value) => {
      this.setState({songName0: value[0], songName1: value[1], songName2: value[2]});
    });
  }

  async componentWillReceiveProps(props) {
    await Promise.all([
      requestTranslationNS(props.lang0, props.name),
      requestTranslationNS(props.lang1, props.name),
      requestTranslationNS(props.lang2, props.name),
    ]).then((value) => {
      this.setState({songName0: value[0], songName1: value[1], songName2: value[2]});
    });
  }

  async onApplyTranslation() {
    const p = this.props;
    const s = this.state;

    await Promise.all([
      p.app.translationUpdate({src: p.name, lang: p.lang0, namespace: 'ns', text: s.songName0}),
      p.app.translationUpdate({src: p.name, lang: p.lang1, namespace: 'ns', text: s.songName1}),
      p.app.translationUpdate({src: p.name, lang: p.lang2, namespace: 'ns', text: s.songName2}),
    ]);

    await Promise.all([
      requestTranslationNS(p.lang0, p.name),
      requestTranslationNS(p.lang1, p.name),
      requestTranslationNS(p.lang2, p.name),
    ]).then((value) => {
      this.setState({songName0: value[0], songName1: value[1], songName2: value[2]});
    });
  }

  render() {
    const p = this.props;

    return <tr className="" key={p._id}>
      <td className="W(15%)"></td>
      <td className="W(35%)"><Link className="btn btn-outline-secondary btn-sm" to={{pathname: `/songs/${p._id}/edit`}}>edit</Link> {p.track}: <strong>{p.name}</strong></td>
      <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="songName0" value={this.state.songName0} onChange={this.onChange}/></td>
      <td> <input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="songName1" value={this.state.songName1} onChange={this.onChange}/></td>
      <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="songName2" value={this.state.songName2} onChange={this.onChange}/></td>
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
    };
    this.onChange = onChange.bind(this);
    this.onApplyTranslation = this.onApplyTranslation.bind(this);
  }

  async componentDidMount() {
    const p = this.props;
    await Promise.all([
      requestTranslationNS(p.lang0, p.name),
      requestTranslationNS(p.lang1, p.name),
      requestTranslationNS(p.lang2, p.name),
    ]).then((value) => {
      this.setState({albumName0: value[0], albumName1: value[1], albumName2: value[2]});
    });
  }

  async componentWillReceiveProps(props) {
    await Promise.all([
      requestTranslationNS(props.lang0, props.name),
      requestTranslationNS(props.lang1, props.name),
      requestTranslationNS(props.lang2, props.name),
    ]).then((value) => {
      this.setState({albumName0: value[0], albumName1: value[1], albumName2: value[2]});
    });
  }

  async onApplyTranslation() {
    const p = this.props;
    const s = this.state;
    await Promise.all([
      p.app.translationUpdate({src: p.name, lang: p.lang0, namespace: 'ns', text: s.albumName0}),
      p.app.translationUpdate({src: p.name, lang: p.lang1, namespace: 'ns', text: s.albumName1}),
      p.app.translationUpdate({src: p.name, lang: p.lang2, namespace: 'ns', text: s.albumName2}),
    ]);

    await Promise.all([
      requestTranslationNS(p.lang0, p.name),
      requestTranslationNS(p.lang1, p.name),
      requestTranslationNS(p.lang2, p.name),
    ]).then((value) => {
      this.setState({albumName0: value[0], albumName1: value[1], albumName2: value[2]});
    });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return <div className="Mb(30px) D(f)">
      <div className="W(10%) Va(t)"><img className="W(90%) rounded shadow-sm" src={p.coverUrl} alt="" /></div>
      <table className="P(10px) W(100%)">
        <tbody>
          <tr>
            <td className="W(15%) Va(t)"><Link className="btn btn-outline-secondary btn-sm" to={{pathname: `/albums/${p._id}/edit`}}>edit</Link> {p.abbr}: <strong>{p.name}</strong></td>
            <td className="W(35%)"></td>
            <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="albumName0" value={s.albumName0} onChange={this.onChange}/></td>
            <td> <input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="albumName1" value={s.albumName1} onChange={this.onChange}/></td>
            <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="albumName2" value={s.albumName2} onChange={this.onChange}/></td>
            <td><button className="btn btn-primary btn-sm" onClick={this.onApplyTranslation}>apply</button></td>
          </tr>
          {p.songs.map((song) => <SongRow {...song} key={song._id} lang0={p.lang0} lang1={p.lang1} lang2={p.lang2} app={this.props.app}/>)}
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
      lang0: 'ja',
      lang1: 'zh-CN',
      lang2: 'en',
    };

    this.onLang0Change = this.onLang0Change.bind(this);
    this.onLang1Change = this.onLang1Change.bind(this);
    this.onLang2Change = this.onLang2Change.bind(this);
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
    const {page} = queryString.parse(this.props.location.search);
    const albums = await this.app.albumList({page});
    this.setState({albums});
  }

  render() {
    const s = this.state;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Songs</h2>
      </section>
      <table className="table">
        <thead>
          <tr>
            <th className="W(10%)">Cover</th>
            <th className="W(13%)">Album</th>
            <th className="W(31%)">Song</th>
            <th> Name <select className="Bdrs(5px) W(80px)" onChange={this.onLang0Change} value={this.state.lang0}>
              {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
            </th>

            <th> Name <select className="Bdrs(5px) W(80px)" onChange={this.onLang1Change} value={this.state.lang1}>
              {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
            </th>

            <th> Name <select className="Bdrs(5px) W(80px)" onChange={this.onLang2Change} value={this.state.lang2}>
              {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
            </th>
            <th className="W(5%)">action</th>
          </tr>
        </thead>
      </table>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100)">
          <div className="Mx(10px) Pt(10px)">
            {s.albums.map((album) => <AlbumRow {...album} key={album.id} lang1={s.lang1} lang2={s.lang2} lang0={s.lang0} app={this.app}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
