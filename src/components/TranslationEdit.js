import React from 'react';
import {onChange, formatDateTime} from '../utils';

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
      lang: this.app.state.lang,
      translations: [],
    };

    this.onApplyTranslation = this.onApplyTranslation.bind(this);
  }

  async componentDidMount() {
    const translations = await this.app.translationList();
    this.setState({translations});
  }

  async componentDidUpdate() {
    if (this.lang !== this.app.state.lang) {
      this.lang = this.app.state.lang;
      this.setState({translations: await this.app.translationList()});
    }
  }

  async onApplyTranslation(p, text) {
    await this.app.translationUpdate({src: p.src, lang: p.lang, text});

    const translations = await this.app.translationList();
    this.setState({translations});
  }

  render() {
    const s = this.state;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Translations</h2>
      </section>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100)">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>src</th>
                <th>lang</th>
                <th>text</th>
                <th>action</th>
                <th>date</th>
                <th>editor</th>
              </tr>
            </thead>
            <tbody>
              {s.translations.map((x) => <Row {...x} onApply={this.onApplyTranslation}/>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>;
  }
}
