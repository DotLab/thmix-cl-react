import React from 'react';
import {Link} from 'react-router-dom';

import {requestTranslationLang, updateTranslationLang} from '../translationService';
// @ts-ignore
import langs from '../json/langs.json';
import {rpc} from '../apiService';

import EditableText from './EditableText';

class Row extends React.Component {
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
    this.props.sourceNameChange(this.props.index, id, this.props.isAlbum);
  }

  async updateTranslation(index, translation) {
    const translations = this.state.translations;
    translations[index] = translation;
    await updateTranslationLang(this.props.langs[index], this.props._id, 'name.artifact', translation);
    this.setState({translations});
    this.props.app.success('Updated');
  }

  render() {
    const p = this.props;
    const s = this.state;

    return <tr key={p._id}>
      {!p.isAlbum ? <td></td> : null}
      <EditableText e="td" className="Fw(b):f" text={p._id} updateText={(id) => this.updateId(id)}/>
      {p.isAlbum ? <td></td> : null}
      {p.langs.map((x, i) => <EditableText key={i} e="td" className="Fw(b):f" text={s.translations[i] || '?'} updateText={(translation) => this.updateTranslation(i, translation)}/>)}
    </tr>;
  }
}

export default class AlbumListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      rows: [],
      langs: ['ja', 'zh-TW', 'en'],
    };

    this.sourceNameChange = this.sourceNameChange.bind(this);
  }

  async componentDidMount() {
    const albums = await rpc('ClWebMidiCustomizedAlbumList', {});
    const rows = albums.reduce((acc, cur) => {
      const midiIds = [].concat(...cur.songs.map((x) => x.midiIds));
      acc.push({_id: cur._id, midiIds, isAlbum: true});
      cur.songs.forEach((x) => acc.push({...x, isAlbum: false}));
      return acc;
    }, []);

    this.setState({rows});
  }

  async sourceNameChange(index, name, isAlbum) {
    const rows = this.state.rows.slice();
    rows.splice(index, 1, {...rows[index], _id: name});
    this.setState({rows});
    const midiIds = rows[index].midiIds;
    await Promise.all([
      midiIds.forEach((x) => this.app.midiUpdate({id: x, [isAlbum ? 'sourceAlbumName' : 'sourceSongName']: name})),
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
          {s.rows.map((row, i) => <Row key={row._id + row.isAlbum} {...row} langs={s.langs} app={this.app}
            sourceNameChange={this.sourceNameChange} index={i}/>)}
        </tbody>
      </table>
    </div>;
  }
}
