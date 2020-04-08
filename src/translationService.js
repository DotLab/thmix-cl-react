import {rpc} from './apiService';
import React from 'react';

/** @type {import('./App.js').default} */
let app_;
let dict_ = {};

const TRANSLATION_LANG_KEY = 'translationLang';
const TRANSLATION_DICT_KEY = 'translationDict';

export function setApp(app) {
  app_ = app;
  const lang = localStorage.getItem(TRANSLATION_LANG_KEY) || 'en';
  dict_ = JSON.parse(localStorage.getItem(TRANSLATION_DICT_KEY) || '{}');
  app.state = {...app.state, lang, translationDict: dict_};
}

export function getKey(namespace, src) {
  return `${app_.state.lang}:${namespace}:${src}`;
}

export function pushDict(key, text) {
  dict_ = {...dict_, [key]: text};
  app_.setState({translationDict: dict_});

  localStorage.setItem(TRANSLATION_LANG_KEY, app_.state.lang);
  localStorage.setItem(TRANSLATION_DICT_KEY, JSON.stringify(dict_));
}

export async function requestTranslation(namespace, src) {
  const key = getKey(namespace, src);
  if (dict_[key]) {
    return;
  }

  pushDict(key, src + '...');
  const text = await rpc('cl_web_translate', {lang: app_.state.lang, namespace, src});
  pushDict(key, text);
}

export const TranslationContext = React.createContext({});

export class Translation extends React.Component {
  static contextType = TranslationContext;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    requestTranslation(this.props.namespace || 'ui.web', this.props.src);
  }

  componentWillReceiveProps() {
    requestTranslation(this.props.namespace || 'ui.web', this.props.src);
  }

  render() {
    const key = getKey(this.props.namespace || 'ui.web', this.props.src);
    const text = this.context[key];
    return <span title={this.props.src}>{text}</span>;
  }
}
