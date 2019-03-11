import React from 'react';
import SampleAvatar from './SampleAvatar.jpg';

export default class App extends React.Component {
  render() {
    return <div className="Bgc($black)">
      <section className="Bgc($gray-600) Pt(60px) Pb(20px) px-5 container text-light ">
        <h2 className="m-0 font-weight-normal">Player <text className="C(springgreen)">Info</text></h2>
      </section>
      {/* intro */}
      <section className="Bgc($gray-800) Bdtw(2px) Bdts(s) Bdc(springgreen) py-3 px-5 container text-light">
        <div className="row">
          <div className="col-md-8">
            <img className="H(100px) rounded shadow-sm d-inline-block" src={SampleAvatar} alt=""/>
            <div className="Lh(1.15) d-inline-block align-middle ml-3">
              <h3 className="h4 m-0">idke</h3>
              <div>Joined <strong>July 2014</strong></div>
              <div>Last seen <strong>4 hours ago</strong></div>
            </div>
          </div>
          <div className="col-md-4">
            <table className="w-100">
              <tbody>
                <tr><td>Play Count</td><td className="text-right font-weight-bold">45,233</td></tr>
                <tr><td>Total Sunshine</td><td className="text-right font-weight-bold">45,233,345,323</td></tr>
                <tr><td>Max Combo</td><td className="text-right font-weight-bold">4,523x</td></tr>
                <tr><td>Accuracy</td><td className="text-right font-weight-bold">45.34%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* rank */}
      <section className="Bgc($gray-900) py-2 px-5 container text-light">
        <div>
          <span className="d-inline-block">
            <div className="Bdc($yellow) Bdts(s) Bdtw(3px) small font-weight-bold">Total Play Time</div>
            <div className="Lh(1)">54d 8h 22m</div>
          </span>
          <span className="d-inline-block ml-2">
            <div className="Bdc($red) Bdts(s) Bdtw(3px) small font-weight-bold">Performance</div>
            <div className="Lh(1)">12,434</div>
          </span>

          <span className="d-inline-block ml-2 ml-lg-5 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) Bgc($purple)! badge badge-pill">S</span></div>
            <div className="Lh(1)">12</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-warning badge-pill">A+</span></div>
            <div className="Lh(1)">12</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-warning badge-pill">A</span></div>
            <div className="Lh(1)">12</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-warning badge-pill">A-</span></div>
            <div className="Lh(1)">12</div>
          </span>
        </div>
        {/* graph */}
        <div className="D(tb) w-100">
          <div className="D(tbr)">
            <div className="D(tbc) w-100">i am a graph</div>
            <div className="D(tbc)">
              <span className="d-inline-block ml-2">
                <div className="Bdc($yellow) Bdts(s) Bdtw(3px) font-weight-bold">Ranking</div>
                <div className="Lh(1) Fz(2em) font-weight-light">#12,434</div>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>;
  }
}
