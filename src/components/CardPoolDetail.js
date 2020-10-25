import React from 'react';
import {Link} from 'react-router-dom';
import nasa2 from '../nasa2.png';
import energy from '../energy.png';
import transparent from '../transparent.png';
import './boxAnimation.css';

import {rpc} from '../apiService';

class CardRow extends React.Component {
  render() {
    const p = this.props;

    return <div className="col H(220px) W(160px) rounded m-3 p-2">
      <div id={p.animation} className="H(200px) W(160px) HBgp(c) Bgz(ct) Bgr(nr) Bgpy(c) shadow-sm rounded-top text-dark" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${p.coverUrl})`}}>
        <div className="Fw(b) badge badge-light C(#fe7f9c)">{p.rarity && p.rarity.toUpperCase()}</div>
        <div className="Fw(b) badge badge-light C(#fe7f9c) D(b) Mt(120px) Mx(a) W(70%)">{p.name.substring(0, 7)}</div>
      </div>
    </div>;
  }
}

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
const asyncIntervals = [];

const runAsyncInterval = async (cb, interval, intervalIndex) => {
  await cb();
  if (asyncIntervals[intervalIndex]) {
    setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
  }
};

const setAsyncInterval = (cb, interval) => {
  if (cb && typeof cb === 'function') {
    const intervalIndex = asyncIntervals.length;
    asyncIntervals.push(true);
    runAsyncInterval(cb, interval, intervalIndex);
    return intervalIndex;
  } else {
    throw new Error('Callback must be a function');
  }
};

const clearAsyncInterval = async () => {
  for (let i = 0; i < asyncIntervals.length; i++) {
    asyncIntervals[i] = false;
  }
  await delay(500);
};

export default class CardPoolDetail extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.drawCardsConfirm = this.drawCardsConfirm.bind(this);
    this.drawCards = this.drawCards.bind(this);

    this.state = {
      name: '',
      creatorId: '',
      packs: [],
      coverUrl: '',

      cardsDrew: [],
      animation: false,

      starStartSize: '50px',
      cardStartSize: '100px',
      starStartPos: ['30%', '300px'],
      cardStartPos: ['57%', '-100px'],
      starId: '',
      cardId: '',
      cardFlipId: '',
      currCardUrl: '',
      cost: 0,
    };
  }

  async componentDidMount() {
    const id = this.props.match.params.id;
    const cardpool = await rpc('ClWebCardPoolGet', {id});
    this.setState(cardpool);
  }

  async drawCardsConfirm() {
    const cards = this.state.cardsDrew;
    await clearAsyncInterval();
    await rpc('ClWebCardDrawConfirm', {});
    this.setState({animation: true, cardsDrew: cards});
    await delay(500);
    this.setState({starId: 'star1'});
    await delay(1000);
    this.setState({starId: 'star2'});
    for (let i = 0; i < cards.length; i++) {
      this.setState({currCardUrl: cards[i].coverUrl});
      await delay(300);
      this.setState({cardId: 'card1'});
      await delay(500);
      this.setState({cardId: '', currCardUrl: ''});
    }
    this.setState({animation: false, starId: '', currCardUrl: '', cardFlipId: 'card2'});

    await delay(2000);
    this.setState({cardFlipId: '', cost: 0});
  }

  async drawCards(packIndex) {
    await clearAsyncInterval();
    this.setState({cardsDrew: [], cost: 1});

    setAsyncInterval(async () => {
      this.setState({cardFlipId: ''});
      const promise = new Promise((resolve) => {
        setTimeout(resolve(), 400);
      });
      await promise;
      const cardsDrew = await rpc('ClWebCardDraw', {cardPoolId: this.props.match.params.id, packIndex});
      this.setState({cardsDrew: cardsDrew, cardFlipId: 'card2'});
    }, 1000);
  }

  render() {
    const s = this.state;
    const canEdit = this.app.state.user && this.app.state.user.id === s.creatorId;

    return <div>
      {!s.animation && <section className="container Pb(100px) shadow">
        <div className="H(300px) D(f) Jc(sa) px-4 py-3 text-center">
          <div className="col-md-3">
            {/* left */}
            <div className="ml-md-auto py-4 Fw(b)">{s.name}</div>
            <div className="Whs(pw) small">{s.desc}</div>
          </div>
          <div className="col-md-8 row py-4">
            {/* right */}
            <img className="shadow Bdrs(4px) Mx(a) H(250px) Maw(200px)" alt="" src={s.coverUrl}/>
            {canEdit && <Link to={`/cardpools/${this.props.match.params.id}/edit`} className="H(fc) Fz(1em) Cur(p) badge badge-pill badge-dark p-3 shadow-sm ml-2" style={{backgroundColor: '#00000080'}} ><i className="fas fa-pencil-alt"></i></Link>}
          </div>
        </div>
        <hr/>
        <div className="D(f) H(100px) px-4 py-3 text-center">
          {s.packs.map((pack, i) => <button key={i} className="mt-1 btn btn-sm btn-outline-warning" onClick={() => this.drawCards(i)}>{pack.name} ~ {pack.cost} gold ~ {pack.cardNum} card</button>)}
        </div>
        <hr/>
        <div className="row">
          {s.cardsDrew.map((card, i) => <CardRow animation={s.cardFlipId} key={i} {...card}/>)}
        </div>
        {s.cost !== 0 && <div>
          <hr/>
          <button className="mt-1 btn btn-sm btn-outline-warning" onClick={this.drawCardsConfirm}>{s.cost} buy </button>
        </div>}
      </section>}

      {s.animation && <section className="H(500px) Bgz(cv) Bgp(c)" style={{backgroundImage: `url(${nasa2})`}}>
        <div style={{marginLeft: s.starStartPos[0], paddingTop: s.starStartPos[1]}}>
          <img id={s.starId} className={`W(${s.starStartSize}) H(${s.starStartSize}) `} alt="" src={energy}/>
        </div>
        <div style={{marginLeft: s.cardStartPos[0], marginTop: s.cardStartPos[1]}}>
          <img style={{height: s.cardStartSize}} id={s.cardId} alt=" " src={s.currCardUrl || transparent}/>
        </div>
      </section>}
    </div>;
  }
}
