import React from 'react';
import DefaultAvatar from './DefaultAvatar.jpg';
import ReactEcharts from 'echarts-for-react';

import {formatDate, formatNumber, getTimeSpan, getTimeSpanBetween, formatTimeSpan, formatDateTime} from '../utils';

const Rank = (s) => (<div className="Bgc($gray-800) Bgc($gray-700):h rounded Lh(1.15) mt-1 D(f) Ai(c)">
  {s.midi.coverUrl && <img className="d-block rounded-left H(50px)" src={s.midi.coverUrl} alt=""/>}
  <span className="d-inline-block badge badge-warning badge-pill Ta(c) ml-2">{s.grade}</span>
  <div className="d-block my-2 ml-2">
    <div className="font-italic">{s.midi.sourceSongName || s.midi.name} <small>by {s.midi.artistName}</small></div>
    <div className="text-warning small">{s.midi.sourceAlbumName} <span className="C($gray-500)">{formatDateTime(s.date)}</span></div>
  </div>
  <div className="D(f) Ai(c) ml-auto mr-2">
    <div className="d-block my-2 ml-4 ml-md-5">
      <div className="text-warning font-italic font-weight-bold">{formatNumber(s.accuracy * 100, 2)}%</div>
    </div>
    <div className="d-block my-2 ml-4">
      <div className="font-italic font-weight-bold">{formatNumber(s.performance, 0)} perf</div>
      {/* <div className="small">weighted 100%</div> */}
    </div>
    <div className="d-block my-2 ml-4">
      <div className="C(lightgreen) font-weight-bold">{formatNumber(s.score)}</div>
    </div>

  </div>
</div>);

const Played = (s) => (<div className="Bgc($gray-800) Bgc($gray-700):h Lh(1.15) pr-3 rounded mt-1 D(f) Ai(c)">
  {s.coverUrl && <img className="d-inline-block rounded-left H(50px)" src={s.coverUrl} alt=""/>}
  <div className="my-2 ml-2">
    <div><strong>{s.midi.sourceSongName || s.midi.name}</strong> <small>by {s.sourceArtistName || (s.composer && s.composer.name) || 'Unknown'}</small></div>
    <div className="C($gray-500) small">midi created by <strong>{s.midi.artistName}</strong></div>
  </div>
  <div className="my-2 ml-auto">
    <div className="text-warning font-weight-bold"><i className="fas fa-play"></i> {s.count}</div>
  </div>
</div>);

function calculateMA(data, dayCount) {
  const result = []; let lastValid = 0;
  for (let i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }

    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      if (data[i - j][0] !== '-') lastValid = data[i - j][1];
      sum += lastValid;
    }
    result.push(sum / dayCount);
  }
  return result;
}

function compileHistory(ohlc) {
  return {
    data: ohlc.map((a) => ([a.o, a.c, a.l, a.h])),
    volume: ohlc.map((a, i) => ([i, a.v, (i === 0 ? 0 : Math.sign(a.c - ohlc[i - 1].c))])),
    xAxis: ohlc.map((a) => formatDateTime(a.t)),
  };
}

const upColor = '#FD1050';
const downColor = '#0CF49B';
const upBorderColor = '#FD1050';
const downBorderColor = '#0CF49B';
const zeroColor = '#000000';

function buildOption({data, volume, xAxis}) {
  return {
    backgroundColor: 'transparent',
    legend: {data: ['CC', 'MA5', 'MA10', 'MA20', 'MA30', 'Volume']},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    axisPointer: {
      link: {xAxisIndex: 'all'},
    },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [{
        value: 1,
        color: upColor,
      }, {
        value: 0,
        color: zeroColor,
      }, {
        value: -1,
        color: downColor,
      }],
    },
    grid: [
      {
        left: '5%',
        right: '5%',
        top: '5%',
        height: '60%',
      },
      {
        left: '5%',
        right: '5%',
        top: '70%',
        height: '15%',
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: xAxis,
        scale: true,
        axisLabel: {show: false},
        // axisLine: {show: false},
        // axisTick: {show: false},
        boundaryGap: false,
        min: 'dataMin',
        max: 'dataMax',
      },
      {
        type: 'category',
        gridIndex: 1,
        data: xAxis,
        scale: true,
        boundaryGap: false,
        min: 'dataMin',
        max: 'dataMax',
      },
    ],
    yAxis: [
      {
        scale: true,
        // splitArea: {show: true},
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        // splitArea: {show: true},
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        // xAxisIndex: [0, 1],
        // start: 50,
        // end: 100,
      },
      {
        show: true,
        type: 'slider',
        xAxisIndex: [0, 1],
        top: '90%',
        height: '10%',
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: 'CC',
        type: 'candlestick',
        data: data,
        itemStyle: {
          normal: {
            color: upColor,
            color0: downColor,
            borderColor: upBorderColor,
            borderColor0: downBorderColor,
          },
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            [
              {
                name: 'from lowest to highest',
                type: 'min',
                valueDim: 'lowest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  normal: {show: false},
                  emphasis: {show: false},
                },
              },
              {
                type: 'max',
                valueDim: 'highest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  normal: {show: false},
                  emphasis: {show: false},
                },
              },
            ],
            {
              name: 'min line on close',
              type: 'min',
              valueDim: 'close',
            },
            {
              name: 'max line on close',
              type: 'max',
              valueDim: 'close',
            },
          ],
        },
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(data, 5),
        smooth: true,
        lineStyle: {normal: {opacity: 0.5}},
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(data, 10),
        smooth: true,
        lineStyle: {normal: {opacity: 0.5}},
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(data, 20),
        smooth: true,
        lineStyle: {normal: {opacity: 0.5}},
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(data, 30),
        smooth: true,
        lineStyle: {normal: {opacity: 0.5}},
      },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volume,
      },
    ],
  };
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.app = props.app;

    this.startEdit = this.startEdit.bind(this);
    this.onPlayHistoryIntervalChange = this.onPlayHistoryIntervalChange.bind(this);

    this.state = {
      playHistoryInterval: '1d',

      id: null,

      name: '',
      email: '',
      salt: '',
      hash: '',
      // meta
      joinedDate: null,
      seenDate: null,
      bio: '',
      avatarUrl: '',
      avatarPath: '',
      // cached
      trialCount: 0,
      score: 0,
      combo: 0,
      accuracy: 0,

      playTime: 0,
      performance: 0,
      ranking: 0,
      sCount: 0,
      aCount: 0,
      bCount: 0,
      cCount: 0,
      dCount: 0,
      fCount: 0,
      bestPerformance: [],
      mostPlayed: [],
      recentlyPlayed: [],
      playHistory: [],
    };
  }

  async componentDidMount() {
    const res = await Promise.all([
      this.app.userGet({id: this.props.match.params.id}),
      this.app.midiBestPerformance({id: this.props.match.params.id}),
      this.app.midiMostPlayed({id: this.props.match.params.id}),
      this.app.midiRecentlyPlayed({id: this.props.match.params.id}),
      this.app.midiPlayHistory({id: this.props.match.params.id, interval: this.state.playHistoryInterval}),
    ]);

    this.setState({
      ...res[0],
      bestPerformance: res[1],
      mostPlayed: res[2],
      recentlyPlayed: res[3],
      playHistory: compileHistory(res[4]),
    });
  }

  async onPlayHistoryIntervalChange(e) {
    const val = e.target.value;
    this.setState({
      playHistoryInterval: val,
      playHistory: compileHistory(await this.app.midiPlayHistory({
        id: this.props.match.params.id,
        interval: val,
      })),
    });
  }

  startEdit() {
    this.app.history.push(`/users/${this.app.state.user.id}/edit`);
  }

  render() {
    const s = this.state;
    const isSelf = this.app.state.user && s.id === this.app.state.user.id;

    return <div className="Bgc($black)">
      <section className="Bgc($gray-600) Pt(60px) Pb(20px) px-5 container text-light ">
        <h2 className="m-0 font-weight-normal">
          Player <span className="C(springgreen)">Info</span>
          {isSelf && <span className="C($gray-100) float-right" onClick={this.startEdit}><button className="btn btn-dark"><i className="fas fa-pencil-alt"></i></button></span>}
        </h2>
      </section>
      {/* intro */}
      <section className="Bgc($gray-800) Bdtw(2px) Bdts(s) Bdc(springgreen) py-3 px-5 container text-light">
        <div className="row">
          <div className="col-md-8">
            <img className="H(100px) rounded shadow-sm d-inline-block" src={s.avatarUrl || DefaultAvatar} alt=""/>
            <div className="Lh(1.15) d-inline-block align-middle ml-3">
              <h3 className="h4 mb-1">{s.name}</h3>
              <div>Joined <strong>{formatDate(s.joinedDate)}</strong></div>
              <div>Last seen <strong>{formatTimeSpan(getTimeSpanBetween(new Date(), s.seenDate))} ago</strong></div>
            </div>
          </div>
          <div className="col-md-4">
            <table className="w-100">
              <tbody>
                <tr><td>Play Count</td><td className="text-right font-weight-bold">{formatNumber(s.trialCount)}</td></tr>
                <tr><td>Total Scores</td><td className="text-right font-weight-bold">{formatNumber(s.score)}</td></tr>
                <tr><td>Average Combo</td><td className="text-right font-weight-bold">{formatNumber(s.avgCombo, 0)}x</td></tr>
                <tr><td>Average Accuracy</td><td className="text-right font-weight-bold">{formatNumber(s.avgAccuracy * 100, 2)}%</td></tr>
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
            <div className="Lh(1)">{formatTimeSpan(getTimeSpan(s.playTime))}</div>
          </span>
          <span className="d-inline-block ml-2">
            <div className="Bdc($gray-100) Bdts(s) Bdtw(3px) small font-weight-bold">Performance</div>
            <div className="Lh(1)">{formatNumber(s.performance)}</div>
          </span>

          <span className="d-inline-block ml-2 ml-lg-5 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) Bgc($purple)! badge badge-pill">S</span></div>
            <div className="Lh(1)">{formatNumber(s.sCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-warning badge-pill">A</span></div>
            <div className="Lh(1)">{formatNumber(s.aCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-light badge-pill">B</span></div>
            <div className="Lh(1)">{formatNumber(s.bCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-info badge-pill">C</span></div>
            <div className="Lh(1)">{formatNumber(s.cCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-danger badge-pill">D</span></div>
            <div className="Lh(1)">{formatNumber(s.dCount)}</div>
          </span>
          <span className="d-inline-block ml-2 text-center">
            <div className="font-weight-bold"><span className="Fz(.8em) badge badge-dark badge-pill">F</span></div>
            <div className="Lh(1)">{formatNumber(s.fCount)}</div>
          </span>
        </div>
        {/* graph */}
        <div className="D(tb) w-100">
          <div className="D(tbr)">
            <div className="D(tbc) w-100">None... yet.</div>
            <div className="D(tbc)">
              <span className="d-inline-block ml-2">
                <div className="Bdc($yellow) Bdts(s) Bdtw(3px) font-weight-bold">Ranking</div>
                <div className="Lh(1) Fz(2em) font-weight-light">#{formatNumber(s.ranking)}</div>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="Bdc(springgreen) Bdts(s) Bdtw(2px) mt-2">
        {/* me */}
        <section className="container Bgc($gray-900) mt-2 px-5 py-3 text-light">
          <h3 className="h5"><span className="Bdc(springgreen) Bdbs(s) Bdbw(2px)">me!</span></h3>
          <div className="Whs(pw)">{s.bio}</div>
        </section>
        {/* ranks */}
        <section className="container Bgc($gray-900) mt-2 px-5 py-3 text-light">
          <h3 className="h5"><span className="Bdc(springgreen) Bdbs(s) Bdbw(2px)">Ranks</span></h3>
          <h4 className="h6 mt-3">Best Performances</h4>
          <div>
            {s.bestPerformance.length === 0 && <span> No performance records. :(</span>}
            {s.bestPerformance.map((x) => <Rank {...x} key={x.midiId}/>)}

          </div>
          <h4 className="h6 mt-3">First Place Ranks <span className="badge badge-pill badge-dark">0</span></h4>
          <div>
            No awesome performance records yet. :(
            {/* <Rank />
            <Rank />
            <Rank />
            <Rank /> */}
          </div>
        </section>
        {/* historical */}
        <section className="container Bgc($gray-900) mt-2 px-5 py-3 text-light">
          <h3 className="h5"><span className="Bdc(springgreen) Bdbs(s) Bdbw(2px)">Historical</span></h3>
          <h4 className="h6 mt-3">
            Play History
            <select className="Bdrs(5px) ml-2" value={s.playHistoryInterval} onChange={this.onPlayHistoryIntervalChange}>
              <option value="1d">1d</option>
              <option value="1h">1h</option>
              <option value="30m">30m</option>
              <option value="15m">15m</option>
              <option value="5m">5m</option>
              <option value="2m">2m</option>
              <option value="1m">1m</option>
            </select>
          </h4>
          {s.playHistory.length === 0 && <div>None... yet.</div>}
          {s.playHistory.length !== 0 && <ReactEcharts option={buildOption(s.playHistory)} theme="thmix_dark" style={{height: '600px', width: '100%'}}/>}
          <h4 className="h6 mt-3">Most Played Midis</h4>
          <div>
            {s.mostPlayed.length === 0 && <span>No performance records. :(</span>}
            {s.mostPlayed.map((x) => <Played {...x} key={x._id}/>)}
          </div>
          <h4 className="h6 mt-3">Recent Plays</h4>
          <div>
            {s.recentlyPlayed.length === 0 && <span> No performance records. :(</span>}
            {s.recentlyPlayed.length === 0 && <span> No performance records. :(</span>}
            {s.recentlyPlayed.map((x, i) => <Rank {...x} key={i}/>)}
          </div>
        </section>
      </div>
    </div>;
  }
}
