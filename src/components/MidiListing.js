import React from 'react';
import {Link} from 'react-router-dom';
import QueryString from 'query-string';

import {onChange, formatNumber, touhouAlbum} from '../utils';

// @ts-ignore
import {albums} from '../json/albums';
// @ts-ignore
import {songs} from '../json/songs';

const Card = (s) => (<div className="col-md-6 mb-2 px-1">
  <div className="H(190px) bg-light rounded shadow-sm border">
    <div className="H(120px) Bgp(c) Bgz(cv) rounded-top text-light p-2" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), url(${s.backgroundUrl})`}}>
      <div className="position-relative w-100 h-100">
        <div className="T(0) Start(0) position-absolute small"><span className="badge badge-lg badge-pill badge-dark p-2 shadow">{s.status}</span></div>
        <div className="T(0) End(0) Lh(1.15) position-absolute text-right">
          <em>{formatNumber(s.playCount)}</em> <i className="small fa-fw fas fa-play"></i><br/>
          <em>{formatNumber(s.upCount - s.downCount)}</em> <i className="small fa-fw fas fa-chevron-up"></i><br/>
          <em>{formatNumber(s.loveCount)}</em> <i className="small fa-fw fas fa-heart"></i><br/>
        </div>
        <div className="B(0) Start(0) Lh(1.15) position-absolute font-italic w-100">
          <Link className="h5 m-0 text-light text-truncate" to={`/midis/${s.id}`}>{s.name}</Link>
          <div>{s.artistName}</div>
        </div>
      </div>
    </div>
    <div className="H(70px) p-2 small">
      <div className="position-relative w-100 h-100">
        <div className="T(0) Start(0) Lh(1.15) position-absolute w-100">
          <div className="small font-weight-bold">uploaded by <Link to={`/users/${s.uploaderId}`}>{s.uploaderName}</Link></div>
          <div className="font-weight-bold text-truncate">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].name : s.sourceAlbumName}</div>
          <div className="Lh(1) font-weight-bold text-truncate">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].songs[s.touhouSongIndex].name : s.sourceSongName}</div>
        </div>
        <div className="B(0) Start(0) Lh(1.15) position-absolute w-100">
          <i className="fa-fw fas fa-sun"></i> {formatNumber(s.avgScore)} <i className="fa-fw fas fa-link"></i> {formatNumber(s.avgCombo)}x <i className="fa-fw fas fa-bullseye"></i> {formatNumber(s.avgAccuracy * 100)}%
        </div>
      </div>
    </div>
  </div>
</div>);

const SortOption = ({query, name, sortAsc, sortDesc}) => {
  if (query.sort === sortAsc) {
    return <Link className="Cur(p) C($pink)! text-dark d-inline-block text-nowrap mr-5" to={'?' + QueryString.stringify({...query, sort: sortDesc})}>{name} <i className="fas fa-caret-up"></i></Link>;
  } else if (query.sort === sortDesc) {
    return <Link className="Cur(p) C($pink)! text-dark d-inline-block text-nowrap mr-5" to={'?' + QueryString.stringify({...query, sort: sortAsc})}>{name} <i className="fas fa-caret-down"></i></Link>;
  } else {
    return <Link className="Cur(p) text-dark d-inline-block text-nowrap mr-5" to={'?' + QueryString.stringify({...query, sort: sortDesc})}>{name}</Link>;
  }
};

export default class MidiListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      query: {},
      midis: [],
      touhouAlbumIndex: '-2',
      touhouSongIndex: '-2',
    };
  }

  getQuery(props) {
    return QueryString.parse(props.location.search);
  }

  async componentDidMount() {
    const query = this.getQuery(this.props);
    // @ts-ignore
    const midis = await this.app.midiList(query);

    this.setState({query, midis});
  }

  async componentWillReceiveProps(props) {
    const query = this.getQuery(props);
    // @ts-ignore
    const midis = await this.app.midiList(query);

    this.setState({query, midis});
  }

  search() {
    const s = this.state;
    const touhouAlbumIndex = parseInt(s.touhouAlbumIndex);
    if (touhouAlbumIndex === -1) {
      this.app.history.push('?' + QueryString.stringify({...s.query, touhouAlbumIndex: -1, touhouSongIndex: undefined}));
    } else if (touhouAlbumIndex > 0) {
      this.app.history.push('?' + QueryString.stringify({...s.query, touhouAlbumIndex, touhouSongIndex: s.touhouSongIndex === '-2' ? undefined : s.touhouSongIndex}));
    } else {
      this.app.history.push('?' + QueryString.stringify({...s.query, touhouAlbumIndex: undefined, touhouSongIndex: undefined}));
    }
  }

  render() {
    const s = this.state;

    return <div className="container">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <div className="Mt(40px) row">
          <select className="form-control col-sm-6" name="touhouAlbumIndex" value={s.touhouAlbumIndex} onChange={this.onChange} onBlur={this.search}>
            <option value="-2">ANY: Any</option>
            {albums.map((x) => <option key={x.album} value={x.album}>{x.tag}: {x.name}</option>)}
          </select>
          <select className="form-control col-sm-6" name="touhouSongIndex" value={s.touhouSongIndex} onChange={this.onChange} onBlur={this.search}>
            <option value="-2">ANY: Any</option>
            {songs.filter((x) => x.album.toString() === s.touhouAlbumIndex).map((x) => <option key={x.song} value={x.song}>{x.song}: {x.name}</option>)}
          </select>
        </div>
        <div className="row small mt-3">
          <div className="col-md-2">STATUS</div>
          <div className="col-md-10">
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== undefined ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: undefined})}>Any</Link>
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== 'APPROVED' ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: 'APPROVED'})}>Approved</Link>
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== 'PENDING' ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: 'PENDING'})}>Pending</Link>
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== 'DEAD' ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: 'DEAD'})}>Dead</Link>
          </div>
        </div>
      </section>

      <section className="mt-2 mb-3 shadow border">
        <div className="py-2 px-3 border-bottom small">
          <span className="Cur(p) d-inline-block text-nowrap mr-5">SORT BY</span>
          <SortOption query={s.query} name="approved date" sortAsc="approvedDate" sortDesc="-approvedDate" />
          <SortOption query={s.query} name="trials" sortAsc="trialCount" sortDesc="-trialCount" />
          <SortOption query={s.query} name="votes" sortAsc="upCount" sortDesc="-upCount" />
          <SortOption query={s.query} name="loves" sortAsc="loveCount" sortDesc="-loveCount" />
          <SortOption query={s.query} name="avg. score" sortAsc="avgScore" sortDesc="-avgScore" />
          <SortOption query={s.query} name="avg. combo" sortAsc="avgCombo" sortDesc="-avgCombo" />
          <SortOption query={s.query} name="avg. accuracy" sortAsc="avgAccuracy" sortDesc="-avgAccuracy" />
        </div>
        <div className="Bgc($gray-100) Px(1.25em) pt-2">
          <div className="row">
            {s.midis.map((midi) => <Card {...midi} key={midi.id} />)}
          </div>
        </div>
      </section>
    </div>;
  }
}
