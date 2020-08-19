import React from 'react';
import {Link} from 'react-router-dom';
import {rpc} from '../apiService';

class CardPool extends React.Component {
  render() {
    const p = this.props;
    return <div className="col-xl-2 col-lg-3 col-md-4 mb-2 px-1">
      <div className="H(370px) bg-light rounded shadow-sm border">
        <Link to={`/cardpools/${p.id}`}>
          <div className="H(300px) Bgp(c) Bgz(cv) rounded-top text-dark p-2 Trsdu(0.5s) Brightness(0.6) Brightness(1):h" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${p.nCards[0].portraitUrl})`}}>
            <div className="B(-60px) position-absolute font-italic">
              <span className="h5">{p.name}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>;
  }
}

export default class CardPoolListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      cardpools: [],
    };
  }

  async componentDidMount() {
    const cardpools = await rpc('ClWebCardPoolList', {});
    this.setState({cardpools});
  }

  render() {
    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Card pool</h2>
      </section>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100)">
          <div className="row M(a) P(10px)">
            {this.state.cardpools.map((pool, i) => <CardPool {...pool} key={i}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
