import React from 'react';
import {onChange, formatDateTime} from '../utils';
import {getKey, updateTranslationLang} from '../translationService';

function correctLang(lang) {
  if (lang === 'zh-CN') {
    return 'zh-Hans';
  }
  if (lang === 'zh-TW') {
    return 'zh-Hant';
  }
  return lang;
}

class Row extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = onChange.bind(this);

    this.state = {
      text: props.text,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src || this.props.lang !== prevProps.lang) {
      this.setState({text: this.props.text});
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return <tr>
      <td className="">{p.src}</td>
      <td className="">{p.namespace}</td>
      <td className="Whs(nw)">{correctLang(p.lang)}</td>
      <td className="W(500px)"><input className="Bdrs(10px) Bdw(1px) D(b) W(100%)" type="text" name="text" onChange={this.onChange} value={s.text}/></td>
      <td><button className="btn btn-primary btn-sm" disabled={s.text === p.text} onClick={() => p.onApply(p, s.text)}>apply</button></td>
      <td>{formatDateTime(p.date)}</td>
      <td>{p.editorName || '?'}</td>
    </tr>;
  }
}

export default class TranslationEdit extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;
    this.lang = this.app.state.lang;

    this.state = {
      filter: '',
      lang: this.app.state.lang,
      translations: [],
      translationsFiltered: [],
    };

    this.onApplyTranslation = this.onApplyTranslation.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.onChange = onChange.bind(this);
  }

  async componentDidMount() {
    const translations = await this.app.translationList();
    const translationsFiltered = translations;
    this.setState({translations, translationsFiltered});
  }

  async componentDidUpdate() {
    if (this.lang !== this.app.state.lang) {
      this.lang = this.app.state.lang;
      this.setState({translations: await this.app.translationList()});
    }
  }

  async onApplyTranslation(p, text) {
    await updateTranslationLang(p.src, p.lang, p.namespace, text);

    const translations = await this.app.translationList();
    this.setState({translations});
  }

  changeFilter(e) {
    e.preventDefault();
    const regex = new RegExp(this.state.filter);
    const translationsFiltered = this.state.translations.filter((x) =>
      [x.src, x.namespace, x.text, x.editorName].join('\n').match(regex)
    );
    this.setState({translationsFiltered});
  }

  render() {
    const s = this.state;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Translations</h2>
      </section>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100)">
          <form onSubmit={this.changeFilter} className="input-group Op(.7)">
            <input className="form-control" type="text" name="filter" value={s.filter} onChange={this.onChange}/>
            <div className="input-group-append">
              <button type="submit" className="btn btn-secondary"><i class="fas fa-filter"></i></button>
            </div>
          </form>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>src</th>
                <th>namespace</th>
                <th>lang</th>
                <th>text</th>
                <th>action</th>
                <th>date</th>
                <th>editor</th>
              </tr>
            </thead>
            <tbody>
              {s.translationsFiltered.map((x) => <Row {...x} key={getKey(x.namespace, x.src)} onApply={this.onApplyTranslation}/>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>;
  }
}
