import React from 'react';
import {Link} from 'react-router-dom';

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
      translations: [],
      langs: [],
    };
  }

  async componentDidMount() {
    const p = this.props;

    if (!p._id) return;
    await Promise.all(
        p.langs.map((x) => requestTranslationLang(x, 'name.artifact', p._id)),
    ).then((value) => {
      this.setState({translations: value});
    });
  }

  async componentDidUpdate(prevProps) {
    if (!this.props._id) return;

    this.props.langs.map(async (x, i) => {
      if (x !== prevProps.langs[i]) {
        const translation = await requestTranslationLang(x, 'name.artifact', this.props._id);
        const translations = this.state.translations.slice();
        translations[i] = translation;
        this.setState({translations, langs: this.props.langs});
      }
    });
  }

  updateId(id) {
    this.props.sourceSongNameChange(this.props.index, id);
  }

  async updateTranslation(index, translation) {
    const translations = this.state.translations;
    translations[index] = translation;
    this.setState({translations});
    await updateTranslationLang(this.props.langs[index], this.props._id, 'name.artifact', translation);
    this.props.app.success('Updated');
  }

  render() {
    const p = this.props;
    const s = this.state;

    return <tr className="" key={p._id}>
      <td></td>
      <EditableText e="td" className="Fw(b):f" text={p._id} updateText={(id) => this.updateId(id)}/>
      {p.langs.map((x, i) => <EditableText key={i} e="td" className="Fw(b):f" text={s.translations[i]} updateText={(translation) => this.updateTranslation(translation)}/>)}
    </tr>;
  }
}

class AlbumRow extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.state = {
      translations: [],
      langs: [],
    };

    this.sourceSongNameChange = this.sourceSongNameChange.bind(this);
  }

  async componentDidMount() {
    const p = this.props;

    if (!p._id) return;
    await Promise.all(
        p.langs.map((x) => requestTranslationLang(x, 'name.artifact', p._id)),
    ).then((value) => {
      this.setState({translations: value});
    });
  }

  async componentDidUpdate(prevProps) {
    if (!this.props._id) return;

    this.props.langs.map(async (x, i) => {
      if (x !== prevProps.langs[i]) {
        const translation = await requestTranslationLang(x, 'name.artifact', this.props._id);
        const translations = this.state.translations.slice();
        translations[i] = translation;
        this.setState({translations, langs: this.props.langs});
      }
    });
  }

  updateId(id) {
    this.props.sourceAlbumNameChange(this.props.index, id);
  }

  async updateTranslation(index, translation) {
    const translations = this.state.translations;
    translations[index] = translation;
    this.setState({translations});
    await updateTranslationLang(this.props.langs[index], this.props._id, 'name.artifact', translation);
    this.props.app.success('Updated');
  }

  async sourceSongNameChange(songIndex, sourceSongName) {
    await this.props.sourceSongNameChange(this.props.index, songIndex, sourceSongName);
  }

  render() {
    const p = this.props;
    const s = this.state;

    return [
      <tr key={p._id}>
        <EditableText e="td" className="Fw(b):f" text={p._id} updateText={(id) => this.updateId(id)}/>
        <td></td>
        {p.langs.map((x, i) => <EditableText key={i} e="td" className="Fw(b):f" text={s.translations[i]} updateText={(translation) => this.updateTranslation(i, translation)}/>)}
      </tr>,
      p.songs.map((song, i) => <SongRow {...song} key={song._id} langs={p.langs} index={i} app={this.props.app} sourceSongNameChange={this.sourceSongNameChange}/>),
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
      langs: ['ja', 'zh-TW', 'en'],
    };

    this.sourceAlbumNameChange = this.sourceAlbumNameChange.bind(this);
    this.sourceSongNameChange = this.sourceSongNameChange.bind(this);
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

  async sourceSongNameChange(albumIndex, songIndex, sourceSongName) {
    const albums = this.state.albums.slice();
    albums[albumIndex].songs.splice(songIndex, 1, {...albums[albumIndex].songs[songIndex], _id: sourceSongName});
    this.setState({albums});
    const midiIds = [];
    albums[albumIndex].songs[songIndex].midiIds.forEach((x) => midiIds.push(x));
    await Promise.all([
      midiIds.forEach((x) => this.app.midiUpdate({id: x, sourceSongName})),
    ]);
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

            {s.langs.map((lang, i) =>
              <th key={i}> Name <select className="Bdrs(5px) W(90px)" onChange={(e) => {
                const langs = this.state.langs.slice();
                langs[i] = e.target.value;
                this.setState({langs});
              }} value={s.langs[i]}>
                {langs.map((x) => <option value={x.lang} key={x.lang}>{x.name}</option>)}</select>
              </th>)}

          </tr>
        </thead>
        <tbody>
          {s.albums.map((album, i) => <AlbumRow key={album._id} {...album} langs={s.langs} app={this.app}
            sourceAlbumNameChange={this.sourceAlbumNameChange} sourceSongNameChange={this.sourceSongNameChange} index={i}/>)}
        </tbody>
      </table>
    </div>;
  }
}
