import React from 'react';
import {Link} from 'react-router-dom';

import SampleAvatar from './SampleAvatar.jpg';

export default class MidiDetail extends React.Component {
  render() {
    return <div>
      <section className="container">
        <div className="Bgp(c) Bgz(cv) text-light row shadow px-md-4" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, .8)), url(https://assets.ppy.sh/beatmaps/163112/covers/card.jpg?1521017332)`}}>
          <div className="col-md-8">
            <div className="pt-2 pb-2 pb-md-4">
              <div><i className="fa-fw fas fa-play"></i>45,994,345 <i className="fa-fw fas fa-chevron-up"></i>45,994 <i className="fa-fw fas fa-heart"></i>454</div>
              <div className="Lh(1.15) font-italic">
                <h2 className="h4 m-0 mt-4 ">Chirei "Gensoukyou Engi Fuujirareshi Youkai-tachi no Page"</h2>
                <div className="h5 m-0">Lexurus</div>
              </div>
              <div className="Cf mt-4">
                <img className="H(60px) rounded float-left" src={SampleAvatar} alt=""/>
                <div className="D(ib) Lh(1.15) ml-2 small">
                  <div className="mb-2">mapped by <Link className="text-light" to="/users/">W h i t e</Link></div>
                  <div>submitted on <strong>5 April 2014</strong></div>
                  <div>approved on <strong>5 May 2014</strong></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-right mt-md-4">
              <span className="Fz(1em) badge badge-pill badge-dark p-3 shadow" style={{backgroundColor: '#00000080'}}>APPROVED</span>
            </div>
            <div className="mt-4 ml-md-auto px-3 py-2" style={{backgroundColor: '#00000060'}}>
              <div><i className="fa-fw fas fa-star"></i>4.8</div>
              <div><i className="fa-fw fas fa-sun"></i>3,384,854</div>
              <div><i className="fa-fw fas fa-link"></i>434x</div>
              <div><i className="fa-fw fas fa-bullseye"></i>100%</div>
            </div>
            <div className="Mt(2px) ml-md-auto px-3 py-2" style={{backgroundColor: '#00000060'}}>
              <div className="text-center">User Rating</div>
              <div>
                <i className="fa-fw fas fa-angle-up"></i>45,394 <span className="float-right"><i className="fa-fw fas fa-angle-down"></i>1,234</span>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow row px-md-4">
          <div className="col-md-8">
            <div className="row py-md-4">
              <div className="col-lg-8">hi</div>
              <div className="col-lg-4">hi</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="Bgc($gray-200) ml-md-auto px-3 py-2">
              <div className="text-center mt-2">Pass Rate</div>
              <div>
                <i className="fa-fw fas fa-check"></i>45,394
                <div className="float-right"><i className="fa-fw fas fa-times"></i>1,234</div>
              </div>
              <div className="text-center mt-2">Grade Cutoff</div>
              <div>
                <div><span className="font-weight-bold">S </span><span className="float-right">45,394</span></div>
                <div><span className="font-weight-bold">A-</span><span className="float-right">44,394</span></div>
                <div><span className="font-weight-bold">B-</span><span className="float-right">40,394</span></div>
                <div><span className="font-weight-bold">C-</span><span className="float-right">30,394</span></div>
                <div><span className="font-weight-bold">D-</span><span className="float-right">20,394</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>;
  }
}
