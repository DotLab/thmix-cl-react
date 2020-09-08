import React from 'react';
import './boxAnimation.css';

import {rpc} from '../apiService';

class CardRow extends React.Component {
  render() {
    const p = this.props;

    return <div className="D(f) H(220px) W(260px) bg-light rounded m-3 p-2">
      <div className="H(200px) W(160px) HBgp(c) Bgz(ct) Bgr(nr) Bgpy(c) shadow-sm border rounded-top text-dark" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${p.coverUrl})`}}></div>
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

    return <section className="container Pb(100px) shadow">
      <div className="Bgp(c) Bgz(ct) Bgr(nr) H(300px) px-4 py-3 text-center"
        style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.0)), url(${s.coverUrl})`}}>


        <div className="col-md-3">
          {/* left */}
          <div className="Whs(pw) small">{s.desc}
          </div>
          <div className="mt-4 ml-md-auto py-2 Bgc(white) Op(0.8) C(gray) Fw(b)">
            <div>N card rate: {s.nRate}%</div>
            <div>R card rate: {s.rRate}%</div>
            <div>SR card rate: {s.srRate}%</div>
            <div>SSR card rate: {s.ssrRate}%</div>
            <div>UR card rate: {s.urRate}%</div>
          </div>
        </div>
      </div>
      <div className="D(f) Bgp(c) Bgz(ct) Bgr(nr) H(100px) px-4 py-3 text-center">
        <div>
          <div className="m-0"><i className="fas fa-coins"></i> {s.cost}</div>
          <button className="mt-1 btn btn-outline-warning" onClick={this.drawOneCard}>1 card</button>
        </div>
        <div>
          <div className="m-0"><i className="fas fa-coins"></i> {s.cost * 10}</div>
          <button className="mt-1 mx-2 btn btn-outline-warning" onClick={this.drawElevenCards}>11 cards</button>
        </div>
      </div>
      <div className="Ta(c) Mt(20px)" >
        <svg width="407" height="376" viewBox="0 0 814 752" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="giftbox">
            <g id="box">
              <path id="Vector" d="M559.73 403.7L347.86 352.67V752L559.73 696.54V403.7Z" fill="#E0E0E0"/>
              <path id="Vector_2" opacity="0.1" d="M559.73 403.7L347.86 352.67V752L559.73 696.54V403.7Z" fill="black"/>
              <path id="Vector_3" d="M135.99 403.7L347.86 352.67V752L135.99 697.65V403.7Z" fill="#E0E0E0"/>
              <path id="Vector_4" opacity="0.17" d="M135.99 401.93L347.86 350.91V752L135.99 697.65V401.93Z" fill="black"/>
              <path id="Vector_5" d="M346.09 354.44L457.68 261.71L669.54 316.07L557.96 405.46L346.09 354.44Z" fill="#E0E0E0"/>
              <path id="Vector_6" d="M29.05 318.94L137.76 405.46L349.62 354.44L242.03 263.48L29.05 318.94Z" fill="#E0E0E0"/>
              <path id="Vector_7" opacity="0.05" d="M27.29 317.18L138.64 405.46L350.51 354.44L240.26 261.71L27.29 317.18Z" fill="black"/>
              <path id="Vector_8" d="M135.99 403.7V697.65L347.86 752L350.72 460.27L135.99 403.7Z" fill="#E0E0E0"/>
              <path id="Vector_9" d="M559.73 696.54L347.86 752V460.27L559.73 403.7V696.54Z" fill="#E0E0E0"/>
              <path id="Vector_10" opacity="0.07" d="M559.73 696.54L347.86 752V460.27L559.73 403.7V696.54Z" fill="black"/>
              <path id="Vector_11" opacity="0.07" d="M475.42 598.92V695.43L559.73 672.13V575.63L475.42 598.92Z" fill="black"/>
              <path id="Vector_12" opacity="0.1" d="M133.22 556.22L251.91 586.17L347.31 508.52V460.82L135.44 407.58L133.22 556.22Z" fill="black"/>
              <path id="Vector_13" opacity="0.1" d="M561.39 556.22L442.7 586.17L347.31 508.52V460.82L559.17 407.58L561.39 556.22Z" fill="black"/>
              <path id="Vector_14" d="M135.99 403.7L27.29 493.55L239.15 546.79L347.86 460.27L135.99 403.7Z" fill="#E0E0E0"/>
              <path id="Vector_15" d="M559.73 403.7L669.54 493.55L458.78 546.79L347.86 460.27L559.73 403.7Z" fill="#E0E0E0"/>
              <path id="Vector_16" opacity="0.07" d="M559.73 403.7L669.54 493.55L458.78 546.79L347.86 460.27L559.73 403.7Z" fill="black"/>
            </g>
            <g id="star3">
              <path id="Vector_17" d="M357.855 6L318.646 28.6372L341.283 67.846L380.492 45.2088L357.855 6Z" fill="#FF6584"/>
              <path id="Vector_18" d="M358.352 76.0179L334.715 35.0765L375.656 11.4393L399.294 52.3812L358.352 76.0179ZM337.447 35.809L359.085 73.2855L396.562 51.6488L374.924 14.1718L337.447 35.809Z" fill="#2F2E41"/>
            </g>
            <g id="star14">
              <path id="Vector_19" d="M290.201 115L278.483 158.732L322.215 170.45L333.933 126.718L290.201 115Z" fill="#F2994A"/>
              <path id="Vector_20" d="M303.663 176.988L258 164.752L270.235 119.088L315.898 131.324L303.663 176.988ZM260.449 163.338L302.249 174.538L313.449 132.738L271.649 121.537L260.449 163.338Z" fill="#2F2E41"/>
            </g>
            <g id="star13">
              <path id="Vector_21" d="M578.209 187L539 209.637L561.637 248.846L600.846 226.209L578.209 187Z" fill="#FF6584"/>
              <path id="Vector_22" d="M578.707 257.018L555.069 216.077L596.01 192.439L619.648 233.381L578.707 257.018ZM557.801 216.809L579.439 254.286L616.916 232.649L595.278 195.172L557.801 216.809Z" fill="#2F2E41"/>
            </g>
            <g id="star12">
              <path id="Vector_23" d="M529.637 298.873L517.919 342.605L561.65 354.323L573.368 310.591L529.637 298.873Z" fill="#56CCF2"/>
              <path id="Vector_24" d="M543.099 360.861L497.436 348.626L509.671 302.962L555.334 315.197L543.099 360.861ZM499.885 347.212L541.685 358.412L552.885 316.611L511.085 305.411L499.885 347.212Z" fill="#2F2E41"/>
            </g>
            <g id="star11">
              <path id="Vector_25" d="M416.855 327L377.646 349.637L400.283 388.846L439.492 366.209L416.855 327Z" fill="#FF6584"/>
              <path id="Vector_26" d="M417.352 397.018L393.715 356.077L434.656 332.439L458.294 373.381L417.352 397.018ZM396.447 356.809L418.085 394.286L455.562 372.649L433.924 335.172L396.447 356.809Z" fill="#2F2E41"/>
            </g>
            <g id="star7">
              <path id="Vector_27" d="M333.201 384.94L321.483 428.671L365.215 440.389L376.933 396.657L333.201 384.94Z" fill="#F2994A"/>
              <path id="Vector_28" d="M346.663 446.927L301 434.692L313.235 389.028L358.898 401.263L346.663 446.927ZM303.449 433.278L345.249 444.478L356.449 402.677L314.649 391.477L303.449 433.278Z" fill="#2F2E41"/>
            </g>
            <g id="star5">
              <path id="Vector_29" d="M162.855 181L123.646 203.637L146.283 242.846L185.492 220.209L162.855 181Z" fill="#FF6584"/>
              <path id="Vector_30" d="M163.352 251.018L139.715 210.077L180.656 186.439L204.294 227.381L163.352 251.018ZM142.447 210.809L164.085 248.286L201.562 226.649L179.924 189.172L142.447 210.809Z" fill="#2F2E41"/>
            </g>
            <g id="star2">
              <path id="Vector_31" d="M79.2011 238.94L67.4832 282.671L111.215 294.389L122.933 250.657L79.2011 238.94Z" fill="#F2994A"/>
              <path id="Vector_32" d="M92.6631 300.927L47 288.692L59.2354 243.028L104.898 255.263L92.6631 300.927ZM49.4492 287.278L91.249 298.478L102.449 256.677L60.6494 245.477L49.4492 287.278Z" fill="#2F2E41"/>
            </g>
            <g id="star8">
              <path id="Vector_33" d="M351.209 238L312 260.637L334.637 299.846L373.846 277.209L351.209 238Z" fill="#F2C94C"/>
              <path id="Vector_34" d="M351.707 308.018L328.069 267.077L369.01 243.439L392.648 284.381L351.707 308.018ZM330.801 267.809L352.439 305.286L389.916 283.649L368.278 246.172L330.801 267.809Z" fill="#2F2E41"/>
            </g>
            <g id="star6">
              <path id="Vector_35" d="M226.201 296.94L214.483 340.671L258.215 352.389L269.933 308.657L226.201 296.94Z" fill="#D0CDE1"/>
              <path id="Vector_36" d="M239.663 358.927L194 346.692L206.235 301.028L251.898 313.263L239.663 358.927ZM196.449 345.278L238.249 356.478L249.449 314.677L207.649 303.477L196.449 345.278Z" fill="#2F2E41"/>
            </g>
            <g id="star10">
              <path id="Vector_37" d="M522.855 76L483.646 98.6372L506.283 137.846L545.492 115.209L522.855 76Z" fill="#F2C94C"/>
              <path id="Vector_38" d="M523.352 146.018L499.715 105.077L540.656 81.4393L564.294 122.381L523.352 146.018ZM502.447 105.809L524.085 143.286L561.562 121.649L539.924 84.1718L502.447 105.809Z" fill="#2F2E41"/>
            </g>
            <g id="star9">
              <path id="Vector_39" d="M439.201 133.94L427.483 177.671L471.215 189.389L482.933 145.657L439.201 133.94Z" fill="#D0CDE1"/>
              <path id="Vector_40" d="M452.663 195.927L407 183.692L419.235 138.028L464.898 150.263L452.663 195.927ZM409.449 182.278L451.249 193.478L462.449 151.677L420.649 140.477L409.449 182.278Z" fill="#2F2E41"/>
            </g>
            <g id="star4">
              <path id="Vector_41" d="M147.855 32L108.646 54.6372L131.283 93.846L170.492 71.2088L147.855 32Z" fill="#56CCF2"/>
              <path id="Vector_42" d="M148.352 102.018L124.715 61.0765L165.656 37.4393L189.294 78.3812L148.352 102.018ZM127.447 61.809L149.085 99.2855L186.562 77.6488L164.924 40.1718L127.447 61.809Z" fill="#2F2E41"/>
            </g>
            <g id="star1">
              <path id="Vector_43" d="M64.2011 89.9395L52.4832 133.671L96.2149 145.389L107.933 101.657L64.2011 89.9395Z" fill="#D0CDE1"/>
              <path id="Vector_44" d="M77.6631 151.927L32 139.692L44.2354 94.0277L89.8984 106.263L77.6631 151.927ZM34.4492 138.278L76.249 149.478L87.4492 107.677L45.6494 96.4769L34.4492 138.278Z" fill="#2F2E41"/>
            </g>
          </g>
        </svg>

      </div>
      <div className="col-md-8 row">
        {/* right */}
        {s.cardsDrew.map((card, i) => <CardRow {...card} key={i}/>)}
      </div>


    </section>;

    // <div className="Bgp(c) Bgz(cv)">
    //   <section className="container" style={{backgroundColor: '#ffffffc0'}}>

    //     {s.isMounted && <div className="H(300px) row shadow px-md-4 " style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url(${s.coverUrl})`}}>
    //       <div className="col-md-8">
    //         <div className="py-2 py-md-4">
    //           <div className="Lh(1.15) font-italic text-light">
    //             <div className="D(f) Ai(c)">
    //               <h2 className="h4 m-0 D(ib) Brightness(1)">{s.name}</h2>
    //             </div>
    //             <div className="mt-4 m-0">1 card cost: {s.cost} <i className="fas fa-coins"></i></div>
    //             <div className="mt-2 m-0">11 card cost: {s.cost * 10} <i className="fas fa-coins"></i></div>
    //             <button className="mt-4 btn btn-secondary" onClick={this.drawOneCard}>1 card</button>
    //             <button className="mt-4 mx-2 btn btn-secondary" onClick={this.drawElevenCards}>11 cards</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>}
    //     <div className="shadow row px-md-4 mb-2">
    //       <div className="col-md-4">
    //         {/* left */}
    //         <div className="py-2">
    //           <h3 className="h6 m-0">Description</h3>
    //           <div className="Whs(pw) small">{s.desc}
    //           </div>
    //           <div className="mt-4 ml-md-auto py-2">
    //             <div>N card rate: {s.nRate}%</div>
    //             <div>R card rate: {s.rRate}%</div>
    //             <div>SR card rate: {s.srRate}%</div>
    //             <div>SSR card rate: {s.ssrRate}%</div>
    //             <div>UR card rate: {s.urRate}%</div>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="col-md-8 row">
    //         {/* right */}
    //         {s.cardsDrew.map((card, i) => <CardRow {...card} key={i}/>)}
    //       </div>
    //     </div>
    //   </section>
    // </div>;
  }
}
