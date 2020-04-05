import React from 'react';
import {Link} from 'react-router-dom';
import QueryString from 'query-string';

import {onChange, formatNumber, touhouAlbum, pushHistory} from '../utils';

const INVALID = '-1';

const Card = (s) => (<div className="col-md-6 mb-2 px-1">
  <div className="H(190px) bg-light rounded shadow-sm border">
    <div className="H(120px) Bgp(c) Bgz(cv) rounded-top text-light p-2" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)), url(${s.coverUrl})`}}>
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

    this.query = QueryString.parse(props.location.search);

    this.onChange = onChange.bind(this);
    this.pushHistory = pushHistory.bind(this);

    this.search = this.search.bind(this);
    this.changeAlbum = this.changeAlbum.bind(this);
    this.changeSong = this.changeSong.bind(this);

    this.state = {
      query: {},
      midis: [],
      touhouAlbumIndex: '-2',
      touhouSongIndex: '-2',
      albums: [],
      songs: [],
      albumId: '',
      songId: '',
      albumName: '',
      songName: '',
    };
  }

  getQuery(props) {
    return QueryString.parse(props.location.search);
  }

  async componentDidMount() {
    const query = this.getQuery(this.props);
    // @ts-ignore
    await Promise.all([
      this.app.midiList(query),
      this.app.albumList(),
    ]).then((value) => {
      this.setState({
        midis: value[0],
        albums: value[1],
      });
    });

    this.setState({query});
  }

  async componentWillReceiveProps(props) {
    const query = this.getQuery(props);
    // @ts-ignore
    const midis = await this.app.midiList(query);
    const search = query.search;
    this.setState({query, midis, search});
  }

  search(e) {
    e.preventDefault();
    const s = this.state;
    this.query.search = s.search;
    this.setState({query: this.query});
    this.pushHistory();
  }

  async changeAlbum(e) {
    if (e.target.value === INVALID) {
      this.query.songId = null;
      this.query.albumId = null;
      this.setState({albumId: '', albumName: '', songName: '', query: this.query});
      this.pushHistory();
      return;
    }
    const albumId = e.target.value;
    this.query.albumId = albumId;
    const albumName = this.state.albums.find((x) => x.id === albumId).name;
    const songs = await this.app.songList({albumId});
    this.setState({albumId, albumName, songs, query: this.query});
    this.pushHistory();
  }

  async changeSong(e) {
    if (e.target.value === INVALID) {
      this.query.songId = null;
      this.setState({songId: '', songName: '', query: this.query});
      this.pushHistory();
      return;
    }
    const songId = e.target.value;
    this.query.songId = songId;
    this.setState({
      songId,
      songName: this.state.songs.find((x) => x.id === songId).name,
      query: this.query,
    });
    this.pushHistory();
  }

  render() {
    const s = this.state;

    return <div className="container">
      <section className="Bgc($gray-700) P(30px) text-light shadow">

        <form onSubmit={this.search} className="input-group">
          <input className="form-control" type="text" name="search" value={s.search} onChange={this.onChange}/>
          <div class="input-group-append">
            <button type="submit" class="btn btn-secondary"><i className="fas fa-search"></i></button>
          </div>
        </form>

        <div className="row small mt-3">
          <div className="col-md-2">STATUS</div>
          <div className="col-md-10">
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== undefined ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: undefined})}>Any</Link>
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== 'APPROVED' ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: 'APPROVED'})}>Approved</Link>
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== 'PENDING' ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: 'PENDING'})}>Pending</Link>
            <Link className={'Cur(p) text-light d-inline-block text-nowrap mr-3' + (s.query.status !== 'DEAD' ? ' C($pink)!' : '')} to={'?' + QueryString.stringify({...s.query, status: 'DEAD'})}>Dead</Link>
          </div>
        </div>

        <div className="row small mt-1">
          <div className="col-md-2">ALBUM</div>
          <div className="col-md-10">
            <div className='Pos(r) Cur(p) text-light d-inline-block text-nowrap mr-3'>{s.albumName || 'Album'}</div>
            <select className="form-control col-sm-6 Pos(a) Cur(p) T(0) H(20px) Op(0)" name="touhouAlbumIndex" value={s.albumId} onChange={this.changeAlbum}>
              <option value={INVALID}>ANY: Any</option>
              {s.albums.map((x) => <option key={x.id} value={x.id}>{x.abbr}: {x.name}</option>)}
            </select>
          </div>
        </div>
        <div className="row small mt-1">
          <div className="col-md-2">SONG</div>
          <div className="col-md-10">
            <div className='Pos(r) Cur(p) text-light d-inline-block text-nowrap mr-3'>{s.songName || 'Song'}</div>
            <select className="form-control col-sm-6 Pos(a) Cur(p) T(0) H(20px) Op(0)" name="touhouSongIndex" value={s.songId} onChange={this.changeSong}>
              <option value={INVALID}>ANY: Any</option>
              {s.songs.map((x) => <option key={x.id} value={x.id}>{x.track}: {x.name}</option>)}
            </select>
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
