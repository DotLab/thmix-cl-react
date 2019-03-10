import React from 'react';
import {Link} from 'react-router-dom';

const Card = () => (<div className="col-md-6 mb-2 px-1">
  <div className="H(180px) bg-light rounded shadow-sm border">
    <div className="H(120px) Bgp(c) Bgz(cv) rounded-top text-light p-2" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, .8)), url(https://assets.ppy.sh/beatmaps/163112/covers/card.jpg?1521017332)`}}>
      <div className="position-relative w-100 h-100">
        <div className="T(0) Start(0) position-absolute small"><span className="badge badge-lg badge-pill badge-dark p-2 shadow">APPROVED</span></div>
        <div className="T(0) End(0) Lh(1.15) position-absolute text-right">
          <em>45,994,345</em> <i className="small fa-fw fas fa-play"></i><br/>
          <em>45,994</em> <i className="small fa-fw fas fa-chevron-up"></i><br/>
          <em>454</em> <i className="small fa-fw fas fa-heart"></i><br/>
        </div>
        <div className="B(0) Start(0) Lh(1.15) position-absolute font-italic w-100">
          <h4 className="h5 m-0 text-truncate">Chirei "Gensoukyou Engi Fuujirareshi Youkai-tachi no Page"</h4>
          <div>Lexurus</div>
        </div>
      </div>
    </div>
    <div className="H(60px) p-2 small">
      <div className="position-relative w-100 h-100">
        <div className="T(0) Start(0) Lh(1.15) position-absolute w-100">
          <div className="small font-weight-bold">uploaded by <Link to="/players/Nao Tomori">Nao Tomori</Link></div>
          <div className="font-weight-bold  text-truncate">私に天使が舞い降りた！</div>
        </div>
        <div className="B(0) Start(0) Lh(1.15) position-absolute w-100">
          <i className="fa-fw fas fa-star"></i>4.8 <i className="fa-fw fas fa-sun"></i>3,384,854 <i className="fa-fw fas fa-link"></i>434x <i className="fa-fw fas fa-bullseye"></i>100%
        </div>
      </div>
    </div>
  </div>
</div>);

export default class MidiListing extends React.Component {
  render() {
    return <div className="container">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <form>
          <div className="Mt(40px) input-group">
            <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="search..."/>
            <div className="input-group-append">
              <button className="btn btn-dark" type="submit"><i className="fas fa-search"></i></button>
            </div>
          </div>
        </form>
        <div className="row small mt-3">
          <div className="col-md-2">CATEGORIES</div>
          <div className="col-md-10">
            {/* <span className="Cur(p) d-inline-block text-nowrap mr-3">Ranked</span> */}
            <span className="Cur(p) d-inline-block text-nowrap mr-3">Approved</span>
            <span className="Cur(p) C($pink) d-inline-block text-nowrap mr-3">Pending</span>
            <span className="Cur(p) C($pink) d-inline-block text-nowrap mr-3">Graveyard</span>
          </div>
        </div>
      </section>

      <section className="mt-2 mb-3 shadow border">
        <div className="py-2 px-3 border-bottom small">
          <span className="Cur(p) d-inline-block text-nowrap mr-5">SORT BY</span>
          <span className="Cur(p) C($pink) d-inline-block text-nowrap mr-5">approved date <i className="fas fa-caret-down"></i></span>
          <span className="Cur(p) d-inline-block text-nowrap mr-5">plays</span>
          <span className="Cur(p) d-inline-block text-nowrap mr-5">votes</span>
          <span className="Cur(p) d-inline-block text-nowrap mr-5">loves</span>
          <span className="Cur(p) d-inline-block text-nowrap mr-5">ratings</span>
          <span className="Cur(p) d-inline-block text-nowrap mr-5">avg. sunshine</span>
          <span className="Cur(p) d-inline-block text-nowrap mr-5">avg. combo</span>
          <span className="Cur(p) d-inline-block text-nowrap mr-5">avg. accuracy</span>
        </div>
        <div className="Bgc($gray-100) Px(1.25em) pt-2">
          <div className="row">
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
          </div>
        </div>
      </section>
    </div>;
  }
}
