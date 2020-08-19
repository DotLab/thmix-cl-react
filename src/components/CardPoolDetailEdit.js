import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';
import {rpc} from '../apiService';
import {FormField, FormFieldTextArea} from './FormField';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

class CardRow extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.state = {
      editingWeight: false,
      weight: this.props.weight,
    };

    this.onChange = onChange.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.updateWeight = this.updateWeight.bind(this);
  }

  removeCard() {
    this.props.removeCard(this.props.id);
  }

  updateWeight() {
    this.setState({editingWeight: false});
    this.props.updateWeight(this.props.id, this.state.weight);
  }

  render() {
    const p = this.props;
    const s = this.state;
    return <tr className="">
      <td></td>
      <td>{p.id}</td>
      <td>
        {!s.editingWeight && <div className="Cur(p)" onClick={() => this.setState({editingWeight: true})}>{p.weight}</div>}
        {s.editingWeight && <div><input className="form-control" type="text" name="weight" value={s.weight} onChange={this.onChange}/></div>}
      </td>

      <td><img className="H(60px)" src={p.portraitUrl} alt=""/></td>
      <td>{p.rarity} {p.poolRarity !== p.rarity && <i className="mx-2 text-danger fas fa-exclamation"></i>}</td>
      <td><div className="D(f)">
        <i className="fas fa-save Cur(p)" onClick={this.updateWeight}></i>
        <i className="mx-3 fas fa-trash-alt Cur(p)" onClick={this.removeCard}></i></div></td>
    </tr>;
  }
}

class CardTable extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.state = {
      editing: false,
      id: '',
      weight: '',
      cards: this.props.cards,
    };

    this.onChange = onChange.bind(this);
    this.insertCard = this.insertCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.import = this.import.bind(this);
    this.updateWeight = this.updateWeight.bind(this);
  }

  async insertCard() {
    for (let i = 0; i < this.state.cards.length; i++) {
      if (this.state.cards[i].id === this.state.id) return;
    }
    const card = await rpc('ClWebCardGet', {id: this.state.id});

    const cards = [...this.state.cards, {...card, weight: this.state.weight}];
    this.setState({cards, id: '', weight: ''});
    this.props.updateTable(this.state.cards, this.props.rarity);
  }

  removeCard(id) {
    let cards = this.state.cards;
    cards = cards.filter((x) => x.id !== id);
    this.setState({cards});
    this.props.updateTable(cards, this.props.rarity);
  }

  async import() {
    let imports = await rpc('ClWebCardList', {rarity: this.props.rarity});
    const cards = this.state.cards;
    cards.forEach((x) => {
      imports = imports.filter((i) => x.id !== i.id);
    });
    imports.forEach((x) => {
      cards.push({...x, weight: 1});
    });
    if (imports.length !== 0) {
      this.setState({cards});
    }
    this.props.updateTable(this.state.cards, this.props.rarity);
  }

  updateWeight(id, weight) {
    let cards = this.state.cards;
    cards = cards.map((x) => {
      return x.id === id ? {...x, weight: parseFloat(weight)} : x;
    });
    this.setState({cards});
    this.props.updateTable(cards, this.props.rarity);
  }

  render() {
    const s = this.state;

    return <div className="text-light">
      <button className="Mend(10px) btn btn-secondary" onClick={this.import}>import all</button>
      <table className="table table-responsive table-sm text-light">
        <thead>
          <tr>
            <th><i className="Fz(30px) fas fa-plus-circle Cur(p)" onClick={() => this.setState({editing: true, id: '', weight: ''})}></i></th>
            <th>card id</th>
            <th>weight</th>
            <th>preview</th>
            <th>rarity</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {s.cards.map((card) => <CardRow {...card} key={card.id} removeCard={this.removeCard} updateWeight={this.updateWeight}
            poolRarity={this.props.rarity} weight={card.weight} />)}
          {s.editing && <tr><td></td>
            <td><input className="form-control" type="text" name="id" value={s.id} onChange={this.onChange}/></td>
            <td><input className="form-control" type="text" name="weight" value={s.weight} onChange={this.onChange}/></td>
            <td></td>
            <td></td>
            <td><div className="D(f)">
              <i className="fas fa-save Cur(p)" onClick={this.insertCard}></i>
              <i className="fas fa-times-circle mx-3 Cur(p)" onClick={() => this.setState({editing: false, id: '', weight: ''})}></i></div>
            </td>
          </tr>}
        </tbody>
      </table>
      <hr/>
    </div>;
  }
}

export default class CardPoolDetailEdit extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onTextareaChange = onTextareaChange.bind(this);
    this.onCheckboxChange = onCheckboxChange.bind(this);
    this.updateMeta = this.updateMeta.bind(this);

    this.onWeightChange = this.onWeightChange.bind(this);
    this.calRate = this.calRate.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.updateCardPool = this.updateCardPool.bind(this);

    this.state = {
      id: null,

      name: '',
      cost: 0,
      nCards: [],
      rCards: [],
      srCards: [],
      ssrCards: [],
      urCards: [],
      isMounted: false,

      nRate: 20,
      rRate: 20,
      srRate: 20,
      ssrRate: 20,
      urRate: 20,

      nWeight: 1,
      rWeight: 1,
      srWeight: 1,
      ssrWeight: 1,
      urWeight: 1,
    };
  }

  async componentDidMount() {
    const cardPool = await rpc('ClWebCardPoolGet', {id: this.props.match.params.id});
    this.setState(cardPool);
    this.setState({isMounted: true});
  }

  async updateMeta() {
    const {id, name, desc, cost} = this.state;
    await rpc('ClWebCardPoolUpdate', {id, name, desc, cost});
  }

  onWeightChange(e) {
    /* eslint-disable-next-line no-invalid-this */
    this.setState({[e.target.name]: e.target.value});
    this.setState({nRate: '', rRate: '', srRate: '', ssrRate: '', urRate: ''});
  }

  calRate() {
    const s = this.state;
    const nRate = (parseFloat(s.nWeight) /(parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight))*100).toFixed(1);
    const rRate = (parseFloat(s.rWeight) /(parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight))*100).toFixed(1);
    const srRate = (parseFloat(s.srWeight) /(parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight))*100).toFixed(1);
    const ssrRate = (parseFloat(s.ssrWeight) /(parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight))*100).toFixed(1);
    const urRate = (parseFloat(s.urWeight) /(parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight))*100).toFixed(1);
    this.setState({nRate, rRate, srRate, ssrRate, urRate});
  }

  updateTable(cards, rarity) {
    switch (rarity) {
      case 'n': this.setState({nCards: cards}); break;
      case 'r': this.setState({rCards: cards}); break;
      case 'sr': this.setState({srCards: cards}); break;
      case 'ssr': this.setState({ssrCards: cards}); break;
      case 'ur': this.setState({urCards: cards}); break;
      default: break;
    }
  }

  async updateCardPool() {
    const s = this.state;
    await rpc('ClWebCardPoolUpdate', {id: this.props.match.params.id,
      nCards: s.nCards,
      rCards: s.rCards,
      srCards: s.srCards,
      ssrCards: s.ssrCards,
      urCards: s.urCards});
    this.app.success('card pool updated');
  }

  render() {
    const s = this.state;

    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Card Pool</strong> Detail</h2>
      </section>

      <Block>
        <Block.Left><h2 className="h5 m-0">Meta</h2></Block.Left>
        <Block.Right>
          <FormField label="card pool name" name="name" value={s.name} onChange={this.onChange}/>
          <FormFieldTextArea label="card pool description" name="desc" value={s.desc} onChange={this.onTextareaChange}/>
          <FormField label="single card cost" name="cost" value={s.cost} onChange={this.onChange}/>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateMeta}>Update</button></div>
          </div>
        </Block.Right>
      </Block>

      <Block>
        <Block.Left><h2 className="h5 m-0">Weight by rarity</h2></Block.Left>
        <Block.Right>
          <FormField label={`(${s.nRate} %)  N`} name="nWeight" value={s.nWeight} onChange={this.onWeightChange}/>
          <FormField label={`(${s.rRate} %)  R`} name="rWeight" value={s.rWeight} onChange={this.onWeightChange}/>
          <FormField label={`(${s.srRate} %)  SR`} name="srWeight" value={s.srWeight} onChange={this.onWeightChange}/>
          <FormField label={`(${s.ssrRate} %)  SSR`} name="ssrWeight" value={s.ssrWeight} onChange={this.onWeightChange}/>
          <FormField label={`(${s.urRate} %)  UR`} name="urWeight" value={s.urWeight} onChange={this.onWeightChange}/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.calRate}>Update</button></div>
          </div>
        </Block.Right>
      </Block>

      {s.isMounted && <Block>
        <Block.Left>
        </Block.Left>
        <Block.Right>
          <div className="mb-3 W(100%)">
            <h2 className="font-weight-light text-light pt-4">N card</h2>
            <CardTable updateTable={this.updateTable} cards={s.nCards} rarity="n"/>
          </div>
          <div className="mb-3 W(100%)">
            <h2 className="font-weight-light text-light pt-4">R card</h2>
            <CardTable updateTable={this.updateTable} cards={s.rCards} rarity="r"/>
          </div>
          <div className="mb-3 W(100%)">
            <h2 className="font-weight-light text-light pt-4">SR card</h2>
            <CardTable updateTable={this.updateTable} cards={s.srCards} rarity="sr"/>
          </div>
          <div className="mb-3 W(100%)">
            <h2 className="font-weight-light text-light pt-4">SSR card</h2>
            <CardTable updateTable={this.updateTable} cards={s.ssrCards} rarity="ssr"/>
          </div>
          <div className="mb-3 W(100%)">
            <h2 className="font-weight-light text-light pt-4">UR card</h2>
            <CardTable updateTable={this.updateTable} cards={s.urCards} rarity="ur"/>
          </div>

          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9">
              <button className="btn btn-primary" onClick={this.updateCardPool}>Update</button>
            </div>
          </div>
        </Block.Right>
      </Block>}
    </div>;
  }
}
