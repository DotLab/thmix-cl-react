import React from 'react';
import milk from '../milky.jpg';
import planet from '../planet.png';
import transparent from '../transparent.png';
import './boxAnimation.css';

import {rpc} from '../apiService';

class CardRow extends React.Component {
  render() {
    const p = this.props;

    return <div className="col H(220px) W(180px) rounded m-3 p-2">
      <div id={p.animation} className="H(200px) W(160px) HBgp(c) Bgz(ct) Bgr(nr) Bgpy(c) shadow-sm rounded-top text-dark" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${p.coverUrl})`}}>
        <div className="Fw(b) badge badge-light C(#fe7f9c)">{p.rarity && p.rarity.toUpperCase()}</div>
        <div className="Fw(b) badge badge-light C(#fe7f9c) D(b) Mt(120px) Mx(a) W(50%)">{p.name}</div>
      </div>
    </div>;
  }
}

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default class CardPoolDetail extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.drawOneCard = this.drawOneCard.bind(this);
    this.drawElevenCards = this.drawElevenCards.bind(this);

    this.state = {
      name: '',
      cost: 0,
      nCards: [],
      rCards: [],
      srCards: [],
      ssrCards: [],
      urCards: [],
      coverUrl: '',

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
      isMounted: false,

      cardsDrew: [],
      animation: false,
      flipAnimation: false,
      starStartSize: '50px',
      starEndSize: '100px',
      cardStartSize: '100px',
      cardEndSize: '100px',
      starStartPos: ['30%', '300px'],
      starEndPos: ['30%', '300px'],
      cardStartPos: ['57%', '-100px'],
      cardEndPos: ['30%', '300px'],
      starId: '',
      cardId: '',
      cardFlipId: '',
      currCardUrl: '',
      currCardRarity: '',
      currCardName: '',
    };
  }

  async componentDidMount() {
    const id = this.props.match.params.id;
    const cardpool = await rpc('ClWebCardPoolGet', {id});

    this.setState(cardpool);
    this.setState({isMounted: true});
    const s = this.state;
    const nRate = (parseFloat(s.nWeight) / (parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight)) * 100).toFixed(1);
    const rRate = (parseFloat(s.rWeight) / (parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight)) * 100).toFixed(1);
    const srRate = (parseFloat(s.srWeight) / (parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight)) * 100).toFixed(1);
    const ssrRate = (parseFloat(s.ssrWeight) / (parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight)) * 100).toFixed(1);
    const urRate = (parseFloat(s.urWeight) / (parseFloat(s.nWeight) + parseFloat(s.rWeight) + parseFloat(s.srWeight) + parseFloat(s.ssrWeight) + parseFloat(s.urWeight)) * 100).toFixed(1);
    this.setState({nRate, rRate, srRate, ssrRate, urRate});
  }

  async drawOneCard() {
    const cardsDrew = await rpc('ClWebCardDrawOnce', {id: this.props.match.params.id});

    this.setState({cardsDrew: [cardsDrew], animation: true});
    await delay(500);
    this.setState({starId: 'star1'});
    await delay(1000);
    // this.setState({currCardUrl: cardsDrew.coverUrl, currCardRarity: cardsDrew.rarity, currCardName: cardsDrew.name});
    this.setState({currCardUrl: cardsDrew.coverUrl, starId: 'star2'});
    this.setState({cardId: 'card1'});
    await delay(2000);
    this.setState({cardId: '', starId: ''});
    this.setState({animation: false, flipAnimation: true, currCardUrl: '', currCardRarity: '', currCardName: '', cardFlipId: 'card2'});
  }

  async drawElevenCards() {
    const cardsDrew = await rpc('ClWebCardDrawEleven', {id: this.props.match.params.id});
    this.setState({cardsDrew: cardsDrew, animation: true});
    await delay(100);
    this.setState({starId: 'star1'});
    await delay(1000);
    this.setState({starId: 'star2'});
    for (let i = 0; i < cardsDrew.length; i++) {
      // this.setState({currCardUrl: cardsDrew[i].coverUrl, currCardRarity: cardsDrew[i].rarity, currCardName: cardsDrew[i].name});
      this.setState({currCardUrl: cardsDrew[i].coverUrl});
      await delay(300);
      this.setState({cardId: 'card1'});
      await delay(2000);
      this.setState({cardId: '', currCardUrl: ''});
    }
    this.setState({animation: false, flipAnimation: true, currCardUrl: '', currCardRarity: '', currCardName: '', cardFlipId: 'card2'});

    await delay(2000);
    this.setState({flipAnimation: false, cardFlipId: ''});
  }

  render() {
    const s = this.state;

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
          </div>
        </div>
        <hr/>
        <div className="D(f) H(100px) px-4 py-3 text-center">
          <button className="mt-1 btn btn-sm btn-outline-warning" onClick={this.drawOneCard}>{s.cost} gold ~ 1 card</button>
          <button className="mt-1 mx-2 btn btn-sm btn-outline-warning" onClick={this.drawElevenCards}>{s.cost * 10} gold ~ 11 cards</button>
        </div>
        <hr/>
        <div className="row">
          {s.cardsDrew.map((card) => <CardRow animation={s.cardFlipId} key={card.id} {...card}/>)}
        </div>
      </section>}

      {s.animation && <section className="H(1200px) Bgz(cv) Bgp(c)" style={{backgroundImage: `url(${milk})`}}>
        <div style={{marginLeft: s.starStartPos[0], paddingTop: s.starStartPos[1]}}>
          <img id={s.starId} className={`W(${s.starStartSize}) H(${s.starStartSize}) `} alt="" src={planet}/>
        </div>
        <div style={{marginLeft: s.cardStartPos[0], marginTop: s.cardStartPos[1]}}>
          <img style={{height: s.cardStartSize}} id={s.cardId} alt=" " src={s.currCardUrl || transparent}/>
        </div>
      </section>}
    </div>;
  }
}
