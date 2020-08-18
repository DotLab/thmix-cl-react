import React from 'react';
// import vampire from '../c7肘/vampire.jpg';
// import walk from '../c7肘/walk.jpg';
// import {Link} from 'react-router-dom';

// class CardPool extends React.Component {
//   render() {
//     const p = this.props;
//     return <Link className="Mend(10px) W(40%) Mih(300px)" to={`/cards/pool/${p.pool}`}><div className="H(100%) Bgp(c) Bgz(cv) rounded-top text-dark p-2" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${p.cover})`}}>
//       <h5><span className="badge badge-lg badge-pill C(gray) p-2 shadow" style={{backgroundColor: '#ffeecc'}}>{p.pool}</span></h5>
//     </div></Link>;
//   }
// }

export default class CardPoolListing extends React.Component {
  render() {
    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Cards </h2>
      </section>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100)">
          <div className="D(f) Jc(c) M(a) P(10px)">
            {/* <CardPool pool="premium" cover={vampire}/>
            <CardPool pool="normal" cover={walk}/> */}
          </div>
        </div>
      </section>
    </div>;
  }
}
