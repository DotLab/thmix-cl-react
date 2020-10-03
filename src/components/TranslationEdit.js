import React from 'react';
import {formatDate} from '../utils';
import {updateTranslationLang} from '../translationService';
import EditableText from './EditableText';

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

    this.updateText = this.updateText.bind(this);

    this.state = {
      text: props.text,
    };
  }

  updateText(text) {
    this.setState({text});
  }

  render() {
    const p = this.props;
    const s = this.state;

    const modified = s.text.trim() !== p.text;

    return <tr className={modified ? 'table-warning Fw(b)' : ''}>
      <td className="Va(m)! ">{p.src}</td>
      <td className="Va(m)! Fw(b)">{p.namespace}</td>
      <td className="Va(m)! Whs(nw)">{correctLang(p.lang)}</td>
      <EditableText className={'Va(m)!'} e="td" text={s.text} updateText={this.updateText} />
      <td className="Va(m)! ">
        <button className="btn btn-primary btn-sm" disabled={!modified} onClick={() => p.onApply(p, s.text)}><i className="fa-fw fas fa-save" /></button>
      </td>
      <td className={'Va(m)!' + (modified ? ' Td(lt)' : '')}>{formatDate(p.date)}</td>
      <td className={'Va(m)!' + (modified ? ' Td(lt)' : '')}>{p.editorName || '?'}</td>
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
      filteredTranslations: [],
    };

    this.onApplyTranslation = this.onApplyTranslation.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
  }

  async componentDidMount() {
    const translations = await this.app.translationList();
    const filteredTranslations = translations;
    this.setState({translations, filteredTranslations});
  }

  async componentDidUpdate() {
    if (this.lang !== this.app.state.lang) {
      this.lang = this.app.state.lang;
      this.setState({translations: await this.app.translationList()});
    }
  }

  async onApplyTranslation({lang, src, namespace}, text) {
    await updateTranslationLang(lang, src, namespace, text);

    const translations = this.state.translations.map((x) => {
      if (x.lang === lang && x.src === src && x.namespace === namespace) {
        x.text = text;
      }
      return x;
    });
    this.setState({translations, filteredTranslations: this.getFilteredTranslations(translations, this.state.filter)});

    this.app.success('translation updated');
  }

  changeFilter(e) {
    this.setState({
      [e.target.name]: e.target.value,
      filteredTranslations: this.getFilteredTranslations(this.state.translations, e.target.value),
    });
  }

  getFilteredTranslations(translations, filter) {
    const regex = new RegExp(filter);
    return translations.filter((x) =>
      [x.src, x.namespace, x.text, x.editorName].join('\n').match(regex)
    );
  }

  render() {
    const s = this.state;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Translations</h2>
      </section>

      <div className="input-group mt-2 shadow">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1"><i className="fas fa-filter"></i></span>
        </div>
        <input className="form-control" type="text" name="filter" value={s.filter} onChange={this.changeFilter}/>
      </div>

      <section className="mt-2 mb-3 shadow">
        <div className="table-responsive">
          <table className="table table-sm table-hover mb-0">
            <thead>
              <tr>
                <th>src</th>
                <th>namespace</th>
                <th>lang</th>
                <th>text</th>
                <th></th>
                <th>date</th>
                <th>editor</th>
              </tr>
            </thead>
            <tbody>
              {s.filteredTranslations.map((x, i) => <Row {...x} key={x._id} onApply={this.onApplyTranslation}/>)}
            </tbody>
          </table>
        </div>
      </section>
    </div>;
  }
}
