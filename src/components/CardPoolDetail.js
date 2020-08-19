import React from 'react';

import {rpc} from '../apiService';

class CardRow extends React.Component {
  render() {
    const p = this.props;

    return <div className="D(f) H(220px) W(260px) bg-light rounded m-3 p-2">
      <div className="H(200px) W(160px) HBgp(c) Bgz(ct) Bgr(nr) Bgpy(c) shadow-sm border rounded-top text-dark" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${p.portraitUrl})`}}></div>
      <div className="mx-2 W(100px)">
        <span className="Fw(b)">{p.rarity && p.rarity.toUpperCase()}</span>
        <div className="">{p.name}</div>
      </div>
    </div>;
  }
}

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
    this.setState({cardsDrew: [cardsDrew]});
  }

  async drawElevenCards() {
    const cardsDrew = await rpc('ClWebCardDrawEleven', {id: this.props.match.params.id});
    this.setState({cardsDrew: cardsDrew});
  }

  render() {
    const s = this.state;

    return <div className="Bgp(c) Bgz(cv)">
      <section className="container" style={{backgroundColor: '#ffffffc0'}}>

        {s.isMounted && <div className="H(300px) row shadow px-md-4 " style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url(${s.nCards[0].portraitUrl})`}}>
          <div className="col-md-8">
            <div className="py-2 py-md-4">
              <div className="Lh(1.15) font-italic text-light">
                <div className="D(f) Ai(c)">
                  <h2 className="h4 m-0 D(ib) Brightness(1)">{s.name}</h2>
                </div>
                <div className="mt-4 m-0">1 card cost: {s.cost} <i className="fas fa-coins"></i></div>
                <div className="mt-2 m-0">11 card cost: {s.cost * 10} <i className="fas fa-coins"></i></div>
                <button className="mt-4 btn btn-secondary" onClick={this.drawOneCard}>1 card</button>
                <button className="mt-4 mx-2 btn btn-secondary" onClick={this.drawElevenCards}>11 cards</button>
              </div>
            </div>
          </div>
        </div>}
        <div className="shadow row px-md-4 mb-2">
          <div className="col-md-4">
            {/* left */}
            <div className="py-2">
              <h3 className="h6 m-0">Description</h3>
              <div className="Whs(pw) small">{s.desc}
              </div>
              <div className="mt-4 ml-md-auto py-2">
                <div>N card rate: {s.nRate}%</div>
                <div>R card rate: {s.rRate}%</div>
                <div>SR card rate: {s.srRate}%</div>
                <div>SSR card rate: {s.ssrRate}%</div>
                <div>UR card rate: {s.urRate}%</div>
              </div>
            </div>
          </div>
          <div className="col-md-8 row">
            {/* right */}
            {s.cardsDrew.map((card, i) => <CardRow {...card} key={i}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
