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

export function saveLang(lang) {
  localStorage.setItem(TRANSLATION_LANG_KEY, lang);
}

export function clearTranslationCache() {
  dict_ = {};
  app_.setState({translationDict: dict_});

  localStorage.setItem(TRANSLATION_LANG_KEY, app_.state.lang);
  localStorage.setItem(TRANSLATION_DICT_KEY, JSON.stringify(dict_));

  window.location.reload();
}

export function pushDict(key, text) {
  pushDictLang(app_.state.lang, key, text);
}

export function pushDictLang(lang, key, text) {
  dict_ = {...dict_, [key]: text};
  app_.setState({translationDict: dict_});

  localStorage.setItem(TRANSLATION_LANG_KEY, lang);
  localStorage.setItem(TRANSLATION_DICT_KEY, JSON.stringify(dict_));
}

/**
 * @param {String} namespace
 * @param {String} src
 * @return {Promise<String>}
 */
export async function requestTranslation(namespace, src) {
  const key = getKey(namespace, src);

  if (namespace.substr(0, 2) === 'ui' && app_.state.lang === 'en') {
    pushDict(key, src);
    return src;
  }

  return requestTranslationLang(app_.state.lang, namespace, src);
}

/**
 * @param {String} lang
 * @param {String} namespace
 * @param {String} src
 * @return {Promise<String>}
 */
export async function requestTranslationLang(lang, namespace, src) {
  const key = `${lang}:${namespace}:${src}`;
  if (dict_[key]) {
    return dict_[key];
  }
  const text = await rpc('cl_web_translate', {lang, src, namespace});
  pushDictLang(lang, key, text);
  return text;
}

export async function updateTranslationLang(lang, src, namespace, text) {
  const key = `${lang}:${namespace}:${src}`;
  pushDictLang(lang, key, text);

  return await rpc('cl_web_translation_update', {lang, src, namespace, text});
}

export const TranslationContext = React.createContext({});

export class Translation extends React.Component {
  static contextType = TranslationContext;

  constructor(props) {
    super(props);
    this.key = null;
  }

  getNamespace() {
    return (this.props.namespace || this.props.ns || 'ui.web');
  }

  refresh() {
    if (!this.props.src) {
      return;
    }

    const key = getKey(this.getNamespace(), this.props.src);
    if (this.key !== key) {
      this.key = key;
      requestTranslation(this.getNamespace(), this.props.src);
    }
  }

  componentDidMount() {
    this.refresh();
  }

  componentWillReceiveProps() {
    this.refresh();
  }

  render() {
    if (!this.props.src) {
      return <span></span>;
    }

    const key = getKey(this.getNamespace(), this.props.src);
    const text = this.context[key];
    return <span title={this.props.src}>{text}</span>;
  }
}

export const UI_VOLATILE = 'ui.volatile';
export const UI_WEB = 'ui.web';
