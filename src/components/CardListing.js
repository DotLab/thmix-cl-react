import React from 'react';
import {rpc} from '../apiService';

class CardRow extends React.Component {
  render() {
    const p = this.props;

    return <div className="col-xl-2 col-lg-3 col-md-3 col-sm-6 mb-2 px-1">
      <div className="H(370px) bg-light rounded shadow-sm border">
        <div className="H(300px) Bgp(c) Bgz(cv) rounded-top text-dark p-2 Trsdu(0.5s) Brightness(0.6) Brightness(1):h" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${p.coverUrl})`}}>
        </div>
        <div className="Lh(1.15) position-absolute w-100 p-2 small">
          <div className="small font-weight-bold">{p.name}</div>
          <div className="small font-weight-bold">uploaded by {p.uploader.name}</div>
          <div className="Lh(1) font-weight-bold text-truncate">illustration by <a className="C(black)" href={p.coverSource}>{p.coverAuthorName}</a></div>
        </div>
      </div>
    </div>;
  }
}

export default class CardListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      cards: [],
    };
  }

  async componentDidMount() {
    const cards = await rpc('ClWebCardList', {});
    this.setState({cards});
  }

  render() {
    const s = this.state;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Cards</h2>
      </section>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100)">
          <div className="row M(a) P(10px)">
            {s.cards.map((card) => <CardRow {...card} key={card.id}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
