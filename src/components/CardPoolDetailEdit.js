import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';
import {rpc} from '../apiService';
import {FormField, FormFieldTextArea} from './FormField';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

class PackRow extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.state = {
      editingName: false,
      editingCardNum: false,
      editingCost: false,
      name: this.props.name,
      cardNum: this.props.cardNum,
      cost: this.props.cost,
    };

    this.onChange = onChange.bind(this);
    this.removePack = this.removePack.bind(this);
    this.updatePack = this.updatePack.bind(this);
  }

  removePack() {
    this.props.removePack(this.props.id);
  }

  updatePack() {
    this.setState({editingName: false, editingCardNum: false, editingCost: false});
    this.props.updatePack(this.props.id, this.state.name, this.state.cardNum, this.state.cost);
  }

  render() {
    const p = this.props;
    const s = this.state;
    return <tr className="">
      <td></td>
      <td>
        {!s.editingName && <div className="Cur(p)" onClick={() => this.setState({editingName: true})}>{p.name}</div>}
        {s.editingName && <div><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></div>}
      </td>

      <td>
        {!s.editingCardNum && <div className="Cur(p)" onClick={() => this.setState({editingCardNum: true})}>{p.cardNum}</div>}
        {s.editingCardNum && <div><input className="form-control" type="number" name="cardNum" value={s.cardNum} onChange={this.onChange}/></div>}
      </td>

      <td>
        {!s.editingCost && <div className="Cur(p)" onClick={() => this.setState({editingCost: true})}>{p.cost}</div>}
        {s.editingCost && <div><input className="form-control" type="number" name="cost" value={s.cost} onChange={this.onChange}/></div>}
      </td>

      <td><div className="D(f)">
        <i className="fas fa-save Cur(p)" onClick={this.updatePack}></i>
        <i className="mx-3 fas fa-trash-alt Cur(p)" onClick={this.removePack}></i></div></td>
    </tr>;
  }
}

class PackTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      packs: this.props.packs,
      editing: false,
      id: '',
      name: '',
      cardNum: 0,
      cost: 0,
    };

    this.onChange = onChange.bind(this);
    this.insertPack = this.insertPack.bind(this);
    this.removePack = this.removePack.bind(this);
    this.updatePack = this.updatePack.bind(this);
  }

  async insertPack() {
    for (let i = 0; i < this.state.packs.length; i++) {
      if (this.state.packs[i].id === this.state.id) return;
    }

    const packs = [...this.state.packs, {name: this.state.name, cardNum: this.state.cardNum, cost: this.state.cost}];
    this.setState({packs, id: '', name: '', cardNum: 0, cost: 0});
    this.props.updatePackTable(packs);
  }

  removePack(id) {
    const packs = this.state.packs;
    packs.splice(id, 1);
    this.setState({packs});
    this.props.updatePackTable(packs);
  }

  updatePack(id, name, cardNum, cost) {
    const packs = this.state.packs;
    packs[id] = {name, cardNum, cost};
    this.setState({packs});
    this.props.updatePackTable(packs);
  }

  render() {
    const s = this.state;

    return <div className="text-light">
      <table className="table table-responsive table-sm text-light">
        <thead>
          <tr>
            <th><i className="Fz(30px) fas fa-plus-circle Cur(p)" onClick={() => this.setState({editing: true, id: '', name: '', cardNum: 0, cost: 0})}></i></th>
            <th>pack name</th>
            <th>number of cards</th>
            <th>cost</th>
          </tr>
        </thead>
        <tbody>
          {s.editing && <tr><td></td>
            <td><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></td>
            <td><input className="form-control" type="number" name="cardNum" value={s.cardNum} onChange={this.onChange}/></td>
            <td><input className="form-control" type="number" name="cost" value={s.cost} onChange={this.onChange}/></td>
            <td></td>
            <td></td>
            <td><div className="D(f)">
              <i className="fas fa-save Cur(p)" onClick={this.insertPack}></i>
              <i className="fas fa-times-circle mx-3 Cur(p)" onClick={() => this.setState({editing: false, id: '', name: '', cardNum: 0, cost: 0})}></i></div>
            </td>
          </tr>}
          {s.packs.map((pack, i) => <PackRow {...pack} key={i} id={i} removePack={this.removePack} updatePack={this.updatePack}/>)}
        </tbody>
      </table>
      <hr/>
    </div>;
  }
}

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

      <td><img className="H(60px)" src={p.coverUrl} alt=""/></td>
      <td>{p.rarity} {p.poolRarity !== p.rarity && <i className="mx-2 text-danger fas fa-exclamation"></i>}</td>
      <td><div className="D(f)">
        <i className="fas fa-save Cur(p)" onClick={this.updateWeight}></i>
        <i className="mx-3 fas fa-trash-alt Cur(p)" onClick={this.removeCard}></i></div></td>
    </tr>;
  }
}

const rarityArr = ['n', 'r', 'sr', 'ssr', 'ur'];

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
    this.props.updateTable(this.state.cards, this.props.ind);
  }

  removeCard(id) {
    let cards = this.state.cards;
    cards = cards.filter((x) => x.id !== id);
    this.setState({cards});
    this.props.updateTable(cards, this.props.ind);
  }

  async import() {
    let imports = await rpc('ClWebCardList', {rarity: rarityArr[this.props.ind]});
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
    this.props.updateTable(this.state.cards, this.props.ind);
  }

  updateWeight(id, weight) {
    let cards = this.state.cards;
    cards = cards.map((x) => {
      return x.id === id ? {...x, weight: parseFloat(weight)} : x;
    });
    this.setState({cards});
    this.props.updateTable(cards, this.props.ind);
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
          {s.cards.map((card, i) => <CardRow {...card} key={i} removeCard={this.removeCard} updateWeight={this.updateWeight}
            poolRarity={rarityArr[this.props.ind]} weight={card.weight} />)}
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

    this.updateRate = this.updateRate.bind(this);
    this.updatePackTable = this.updatePackTable.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.updateCardPool = this.updateCardPool.bind(this);
    this.updatePack = this.updatePack.bind(this);

    this.state = {
      id: null,

      name: '',
      isMounted: false,

      rates: [],
      packs: [],
      group: [],
    };
  }

  async componentDidMount() {
    const cardPool = await rpc('ClWebCardPoolGet', {id: this.props.match.params.id});
    this.setState(cardPool);
    const weights = [];
    const rates = [];
    cardPool.group.forEach((x) => weights.push(x.weight || 0));
    const sum = weights.reduce((acc, cur) => acc + cur, 0);
    weights.forEach((x) => rates.push((parseFloat(x) / sum * 100).toFixed(1)));
    this.setState({rates});
    this.setState({isMounted: true});
  }

  async updateMeta() {
    const {id, name, desc} = this.state;
    await rpc('ClWebCardPoolUpdate', {id, name, desc});
    this.app.success('card pool updated');
  }

  async updatePack() {
    const {id, packs} = this.state;
    await rpc('ClWebCardPoolUpdate', {id, packs});
    this.app.success('card pool updated');
  }

  async updateRate() {
    const s = this.state;
    let group = this.state.group.slice();
    group = group.map((x) => ({name: x.name, weight: x.weight, cards: x.cards.map((y) => ({cardId: y.id, weight: y.weight}))}));
    await rpc('ClWebCardPoolUpdate', {id: s.id, group});
    const weights = [];
    const rates = [];
    s.group.forEach((x) => weights.push(parseFloat(x.weight) || 0));
    const sum = weights.reduce((acc, cur) => acc + cur, 0);
    weights.forEach((x) => rates.push((parseFloat(x) / sum * 100).toFixed(1)));
    this.setState({rates});
    this.app.success('card pool updated');
  }

  updatePackTable(packs) {
    this.setState({packs});
  }

  updateTable(cards, ind) {
    const group = this.state.group;
    group[ind].cards = cards;
    this.setState({group});
  }

  async updateCardPool() {
    let group = this.state.group.slice();
    group = group.map((x) => ({name: x.name, weight: x.weight, cards: x.cards.map((y) => ({cardId: y.id, weight: y.weight}))}));

    await rpc('ClWebCardPoolUpdate', {id: this.props.match.params.id, group});
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

          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateMeta}>Update</button></div>
          </div>
        </Block.Right>
      </Block>

      <Block>
        <Block.Left><h2 className="h5 m-0">Weight by group</h2></Block.Left>
        <Block.Right>
          {s.group.map((x, i) => <FormField key={i} label={`(${s.rates[i] || ''} %)  ${x.name.substring(0, x.name.length - 5)}`} value={x.weight || ''} onChange={(e) => {
            const group = this.state.group;
            group[i].weight = e.target.value || 0;
            this.setState({group, rates: []});
          }}/>)}
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateRate}>Update</button></div>
          </div>
        </Block.Right>
      </Block>

      {s.isMounted && <Block>
        <Block.Left><h2 className="h5 m-0">Packs</h2></Block.Left>
        <Block.Right>
          <div className="mb-3 W(100%)">
            <PackTable updatePackTable={this.updatePackTable} packs={s.packs}/>
          </div>

          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9">
              <button className="btn btn-primary" onClick={this.updatePack}>Update</button>
            </div>
          </div>
        </Block.Right>
      </Block>}

      {s.isMounted && <Block>
        <Block.Left></Block.Left>
        <Block.Right>
          {s.group && s.group.map((x, i) => <div className="mb-3 W(100%)" key={i}>
            <h2 className="font-weight-light text-light pt-4">{x.name}</h2>
            <CardTable updateTable={this.updateTable} cards={x.cards} ind={i}/>
          </div>)}

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
