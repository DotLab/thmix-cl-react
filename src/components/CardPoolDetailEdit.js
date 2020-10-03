import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange, formatPct} from '../utils';
import {rpc} from '../apiService';
import {FormField, FormFieldTextArea} from './FormField';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

function getWeightSum(arr) {
  return arr.reduce((acc, cur) => acc + (parseFloat(cur.weight) || 0), 0);
}

class EditableText extends React.Component {
  constructor(props) {
    super(props);
    this.spanRef = React.createRef();
    this.updateText = this.updateText.bind(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (document.activeElement !== this.spanRef.current) {
      this.spanRef.current.innerText = String(props.text);
    }
  }

  async updateText() {
    const text = this.spanRef.current.innerText;
    if (text != String(this.props.text)) {
      if (!await this.props.updateText(text)) {
        this.spanRef.current.innerText = String(this.props.text);
      }
    }
  }

  render() {
    return React.createElement(this.props.e || 'span', {
      className: this.props.className,
      ref: this.spanRef,
      contentEditable: 'true',
      suppressContentEditableWarning: true,
      onBlur: this.updateText,
    }, [String(this.props.text)]);
  }
}

class PackRow extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = onChange.bind(this);
    this.removePack = this.removePack.bind(this);
    this.updatePack = this.updatePack.bind(this);
  }

  removePack() {
    this.props.removePack(this.props.id);
  }

  updatePack(pack) {
    this.props.updatePack(this.props.id, pack);
  }

  render() {
    return <tr className="">
      <EditableText e="td" className="Fw(b):f" text={this.props.name} updateText={(name) => this.updatePack({name})} />
      <EditableText e="td" className="Fw(b):f Ta(end)" text={this.props.cardNum} updateText={(cardNum) => this.updatePack({cardNum})} />
      <EditableText e="td" className="Fw(b):f Ta(end)" text={this.props.cost} updateText={(cost) => this.updatePack({cost})} />
      <td><i className="fas fa-trash-alt fa-fw Cur(p)" onClick={this.removePack}></i></td>
    </tr>;
  }
}

class PackTable extends React.Component {
  constructor(props) {
    super(props);

    this.insertPack = this.insertPack.bind(this);
    this.removePack = this.removePack.bind(this);
    this.updatePack = this.updatePack.bind(this);
  }

  async insertPack() {
    const packs = [
      ...this.props.packs,
      {name: 'Draw 0 Card', cardNum: 0, cost: 0},
    ];
    this.props.updatePacks(packs);
  }

  removePack(index) {
    const packs = this.props.packs;
    packs.splice(index, 1);
    this.props.updatePacks(packs);
  }

  updatePack(index, pack) {
    const packs = this.props.packs;
    const newPacks = packs.slice();
    newPacks.splice(index, 1, {...packs[index], ...pack});
    this.props.updatePacks(newPacks);
  }

  render() {
    return <table className="table table-sm table-dark table-striped Bdrs(5px)">
      <thead>
        <tr>
          <th>pack name</th>
          <th className="Ta(end)">number of cards</th>
          <th className="Ta(end)">cost</th>
        </tr>
      </thead>
      <tbody>
        {this.props.packs.map((pack, i) => <PackRow {...pack} key={i} id={i} removePack={this.removePack} updatePack={this.updatePack}/>)}
        <tr>
          <td></td><td></td><td></td>
          <td><i className="fas fa-plus-circle fa-fw Cur(p)" onClick={this.insertPack}></i></td></tr>
      </tbody>
    </table>;
  }
}

class CardRow extends React.Component {
  constructor(props) {
    super(props);

    this.removeCard = this.removeCard.bind(this);
    this.updateWeight = this.updateWeight.bind(this);
  }

  removeCard() {
    this.props.removeCard(this.props.index);
  }

  updateWeight(weight) {
    this.props.updateWeight(this.props.index, weight);
  }

  updateId(cardId) {
    this.props.updateId(this.props.index, cardId);
  }

  render() {
    const p = this.props;

    return <tr className="">
      <EditableText e="td" className="Va(m)! Fw(b):f" text={p.id} updateText={(id) => this.updateId(id)} />
      <EditableText e="td" className="Va(m)! Ta(end) Fw(b):f" text={p.weight} updateText={(weight) => this.updateWeight(weight)} />
      <td className="Va(m)! Ta(end)">{formatPct(p.weight / p.cardWeightSum, 2)}</td>
      <td className="Va(m)! Ta(end)">{formatPct(p.weight / p.cardWeightSum * p.groupWeight / p.groupWeightSum, 5)}</td>
      <td className="Va(m)! Bgz(ct) Bgr(nr) Bgp(c) Trsdu(.5s) H(0) H(100px):h " style={{backgroundImage: `url(${p.coverUrl})`}}></td>
      <td className="Va(m)! Ta(c) Tt(u) Fw(b)">{p.rarity}</td>
      <td className="Va(m)!"><i className="fas fa-trash-alt fa-fw Cur(p)" onClick={this.removeCard}></i></td>
    </tr>;
  }
}

const rarityArr = ['ur', 'ssr', 'sr', 'r', 'n'];

class CardGroupTable extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = onChange.bind(this);
    this.import = this.import.bind(this);
    this.updateWeight = this.updateWeight.bind(this);
    this.updateId = this.updateId.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.insertCard = this.insertCard.bind(this);
  }

  async import() {
    const cards = await rpc('ClWebCardList', {rarity: rarityArr[this.props.index]});
    this.props.updateCardTable(cards.map((x) => ({...x, weight: 1})), this.props.index);
  }

  updateWeight(index, weight) {
    const cards = this.props.cards.slice();
    cards[index].weight = parseFloat(weight);
    this.props.updateCardTable(cards, this.props.index);
  }

  async updateId(index, id) {
    const card = await rpc('ClWebCardGet', {id});

    const cards = this.props.cards;
    const newCards = cards.slice();
    newCards.splice(index, 1, {...card, weight: cards[index].weight});
    this.props.updateCardTable(newCards, this.props.index);
  }

  insertCard() {
    const cards = this.props.cards.slice();
    cards.push({weight: 0});
    this.props.updateCardTable(cards, this.props.index);
  }

  removeCard(index) {
    const cards = this.props.cards.slice();
    cards.splice(index, 1);
    this.props.updateCardTable(cards, this.props.index);
  }

  render() {
    return <div>
      <h2 className="font-weight-light text-light pt-4">{this.props.name} <button className="btn btn-info" onClick={this.import}>import all</button></h2>
      <div className="table-responsive">
        <table className="table table-sm table-dark table-striped Bdrs(5px)">
          <thead>
            <tr>
              <th>card id</th>
              <th className="Ta(end)">weight</th>
              <th className="Ta(end)">group pct</th>
              <th className="Ta(end)">pool pct</th>
              <th>image</th>
              <th className="Ta(c)">rarity</th>
            </tr>
          </thead>
          <tbody>
            {this.props.cards.map((card, i) => <CardRow
              {...card}
              key={i}
              index={i}
              cardWeightSum={getWeightSum(this.props.cards)}
              groupWeight={this.props.groupWeight}
              groupWeightSum={this.props.groupWeightSum}
              removeCard={this.removeCard}
              updateWeight={this.updateWeight} updateId={this.updateId} />)}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td><i className="fa-fw fas fa-plus-circle Cur(p)" onClick={this.insertCard}></i></td>
            </tr>
          </tbody>
        </table>
      </div>
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

    this.updateGroupWeights = this.updateGroupWeights.bind(this);
    this.updateCardTable = this.updateCardTable.bind(this);
    this.updateCardPool = this.updateCardPool.bind(this);
    this.updatePacks = this.updatePacks.bind(this);

    this.state = {
      id: null,

      name: '',

      groupWeightSum: 0,
      packs: [],
      group: [],
    };
  }

  async componentDidMount() {
    const cardPool = await rpc('ClWebCardPoolGet', {id: this.props.match.params.id});
    this.setState({...cardPool, groupWeightSum: this.getWeightSum(cardPool.group)});
  }

  async updateMeta() {
    const {id, name, desc} = this.state;
    await rpc('ClWebCardPoolUpdate', {id, name, desc});
    this.app.success('card pool updated');
  }

  async updatePacks(packs) {
    await rpc('ClWebCardPoolUpdate', {id: this.state.id, packs});
    this.setState({packs});
    this.app.success('card pool updated');
  }

  async updateGroupWeights() {
    const s = this.state;
    await rpc('ClWebCardPoolUpdate', {
      id: s.id,
      group: this.state.group.slice().map((x) => ({
        name: x.name,
        weight: x.weight,
        cards: x.cards.map((y) => ({cardId: y.id, weight: y.weight})),
      })),
    });

    this.updateGroupWeightSum();
    this.app.success('card pool updated');
  }

  getWeightSum(arr) {
    return arr.reduce((acc, cur) => acc + (parseFloat(cur.weight) || 0), 0);
  }

  updateGroupWeightSum() {
    const groupWeightSum = this.getWeightSum(this.state.group);
    this.setState({groupWeightSum});
  }

  updateCardTable(cards, index) {
    const group = this.state.group;
    group[index].cards = cards;
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

          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateMeta}>update</button></div>
          </div>
        </Block.Right>
      </Block>

      <Block>
        <Block.Left><h2 className="h5 m-0">Packs</h2></Block.Left>
        <Block.Right>
          <div className="mb-3 W(100%)">
            <PackTable updatePacks={this.updatePacks} packs={s.packs}/>
          </div>
        </Block.Right>
      </Block>

      <Block>
        <Block.Left><h2 className="h5 m-0">Card Group Weights</h2></Block.Left>
        <Block.Right>
          {s.group.map((x, i) => <FormField
            key={i} label={`(${formatPct(x.weight / s.groupWeightSum, 2)})  ${x.name.substring(0, x.name.length - 5)}`} value={x.weight || ''}
            onChange={(e) => {
              const group = this.state.group;
              group[i].weight = e.target.value || 0;
              this.setState({group, groupWeightSum: this.getWeightSum(group)});
            }}
          />)}
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateGroupWeights}>update</button></div>
          </div>
        </Block.Right>
      </Block>

      <Block>
        <Block.Left><h2 className="h5 m-0">Card Groups</h2></Block.Left>
        <Block.Right>
          {s.group && s.group.map((x, i) => <CardGroupTable
            key={i}
            name={x.name}
            updateCardTable={this.updateCardTable}
            groupWeight={x.weight}
            groupWeightSum={s.groupWeightSum}
            cards={x.cards}
            index={i}
          />)}

          <div className="form-group row">
            <div className="col">
              <button className="btn btn-primary" onClick={this.updateCardPool}>update</button>
            </div>
          </div>
        </Block.Right>
      </Block>
    </div>;
  }
}
