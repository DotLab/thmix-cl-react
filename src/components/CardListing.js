import React from 'react';
import queryString from 'query-string';

import {rpc} from '../apiService';
import {deleteFalsyKeys, onChange} from '../utils';
import {Link} from 'react-router-dom';

const OPTION_ANY = '-1';

const dict = {
  Haru: 'haru',
  Rei: 'rei',
  Ma: 'ma',
  N: 'n',
  R: 'r',
  SR: 'sr',
  UR: 'ur',
  haru: ['#ffb3d8', '#cd0063'],
  rei: ['#a8efc2', '#1c9649'],
  ma: ['#b8e6ff', '#0088d2'],
};

const Card = (s) => (
  <div className="col-md-4 mb-2 px-2 mt-4 rounded">
    <div className="bg-light rounded">
      <Link to={`/cards/${s.id}`} ><img className="W(100%) rounded" src={s.url} alt=""/></Link>
    </div>
    <div className="H(50px) p-2 small shadow-sm rounded">
      <div className="position-relative w-100 h-100">
        <div className="T(0) Start(0) Lh(1.15) position-absolute w-100">
          <div className="small font-weight-bold" style={{color: `${dict[s.attribute][1]}`}}>uploaded by <Link to={`/users/${s.uploader.id}`} style={{color: `${dict[s.attribute][1]}`}}>{s.uploader.name}</Link></div>
        </div>
      </div>

    </div>
  </div>
);

export default class CardListing extends React.Component {
  constructor(props) {
    super(props);
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onChangeRarity = this.onChangeRarity.bind(this);
    this.onChangeAttribute = this.onChangeAttribute.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.state = {
      cards: [],
      searchInput: '',
      isLoading: true,
    };
  }

  async componentDidMount() {
    const cards = await rpc('cl_web_card_list', {});
    this.setState({isLoading: false, cards});
  }

  async componentWillReceiveProps(props) {
    const {rarity, attribute, page, search} = queryString.parse(props.location.search);
    this.setState({isLoading: true});
    this.setState({isLoading: false, cards: await rpc('cl_web_card_list', {rarity: dict[rarity], attribute: dict[attribute], page, search})});
  }

  getQuery() {
    return queryString.parse(this.props.location.search);
  }

  pushQuery(spec) {
    const query = deleteFalsyKeys({...this.getQuery(), search: this.state.searchInput, ...spec});
    this.props.history.push(this.props.location.pathname + '?' + queryString.stringify(query));
    return query;
  }

  onChangeRarity(e) {
    const rarity = e.target.value;
    if (rarity === OPTION_ANY) {
      this.pushQuery({page: undefined, rarity: undefined});
    } else {
      this.pushQuery({page: undefined, rarity});
    }
  }

  onChangeAttribute(e) {
    const attribute = e.target.value;
    if (attribute === OPTION_ANY) {
      this.pushQuery({page: undefined, attribute: undefined});
    } else {
      this.pushQuery({page: undefined, attribute});
    }
  }

  onSearch(e) {
    e.preventDefault();
    this.pushQuery({page: undefined});
  }

  render() {
    const s = this.state;
    const q = this.getQuery();

    return <div className="container">
      <section className="Bgc($gray-700) P(30px) text-light shadow">

        <form onSubmit={this.onSearch} className="input-group">
          <input className="form-control" type="text" name="searchInput" value={s.searchInput} onChange={this.onChange}/>
          <div className="input-group-append">
            <button type="submit" className="btn btn-secondary"><i className="fas fa-search"></i></button>
          </div>
        </form>
        <div className="small mt-4">
          <div className="d-inline mr-2 mr-md-5">Rarity</div>
          <div className="d-inline Pos(r)">
            <div className='Cur(p) text-light d-inline-block text-nowrap mr-3'>{q.rarity || 'any'}</div>
            <select className="form-control Pos(a) Cur(p) Start(0) T(0) H(20px) Op(0) W(maxc)" value={q.rarity} onChange={this.onChangeRarity}>
              <option value={OPTION_ANY}>Any</option>
              <option value="N">N</option>
              <option value="R">R</option>
              <option value="SR">SR</option>
              <option value="UR">UR</option>
            </select>
          </div>
        </div>
        <div className="small mt-1">
          <div className="d-inline mr-2 mr-md-5">Attribute</div>
          <div className="d-inline Pos(r)">
            <div className='Cur(p) text-light d-inline-block text-nowrap mr-3'>{q.attribute || 'any'}</div>
            <select className="form-control Pos(a) Cur(p) Start(0) T(0) H(20px) Op(0) W(maxc)" value={q.attribute} onChange={this.onChangeAttribute}>
              <option value={OPTION_ANY}>Any</option>
              <option value="Haru">Haru</option>
              <option value="Rei">Rei</option>
              <option value="Ma">Ma</option>
            </select>
          </div>
        </div>
      </section>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100) Px(1.25em) pt-2">
          <div className="row">
            {parseInt(String(q.page)) > 0 && <div className="col-12 mb-2 px-1">
              <button className="btn btn-block btn-outline-secondary" onClick={this.onLoadPrevPage}>load prev page ({parseInt(String(q.page || 0)) - 1})</button>
            </div>}

            {s.isLoading ? <div className="col-12 mb-2 px-1 D(f)">
              <div className="spinner-border mx-auto"></div>
            </div> : s.cards.map((card) => <Card {...card} key={card.id}/>)}
            <div className="col-12 mb-2 px-1">
              <button className="btn btn-block btn-outline-secondary" onClick={this.onLoadNextPage}>load next page ({parseInt(String(q.page || 0)) + 1})</button>
            </div>
          </div>
        </div>
      </section>
    </div>;
  }
}
