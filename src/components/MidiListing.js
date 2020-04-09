import React from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';

import {onChange, formatNumber, touhouAlbum, deleteFalsyKeys} from '../utils';

const OPTION_ANY = '-1';

const ListingFilterButton = (p) => (<span className={'Cur(p) d-inline-block text-nowrap mr-2 mr-md-3 ' + (p.active ? 'C($white)' : 'C($pink)')} onClick={p.onClick}>{p.option}</span>);

const Card = (s) => (<div className="col-md-6 mb-2 px-1">
  <div className="H(190px) bg-light rounded shadow-sm border">
    <div className="H(120px) Bgp(c) Bgz(cv) rounded-top text-light p-2" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, .2), rgba(0, 0, 0, .5)), url(${s.coverUrl})`}}>
      <div className="position-relative w-100 h-100">
        <div className="T(0) Start(0) position-absolute small"><span className="badge badge-lg badge-pill badge-dark p-2 shadow" style={{backgroundColor: '#00000080'}}>{s.status}</span></div>
        <div className="T(0) End(0) Lh(1.15) position-absolute text-right">
          <em>{formatNumber(s.trialCount)}</em> <i className="small fa-fw fas fa-play"></i><br/>
          <em>{formatNumber(s.voteSum)}</em> <i className="small fa-fw fas fa-chevron-up"></i><br/>
          <em>{formatNumber(s.loveCount)}</em> <i className="small fa-fw fas fa-heart"></i><br/>
        </div>
        <div className="B(0) Start(0) Lh(1.15) position-absolute font-italic w-100">
          <Link className="h5 m-0 text-light" to={`/midis/${s.id}`}>{s.name}</Link>
          <div>{s.artistName}</div>
        </div>
      </div>
    </div>
    <div className="H(70px) Bgp(c) Bgz(cv) rounded-bottom p-2 small" style={{backgroundImage: `linear-gradient(rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), url(${s.coverBlurUrl})`}}>
      <div className="position-relative w-100 h-100">
        <div className="T(0) Start(0) Lh(1.15) position-absolute w-100">
          <div className="small font-weight-bold">uploaded by <Link to={`/users/${s.uploaderId}`}>{s.uploaderName}</Link></div>
          <div className="font-weight-bold text-truncate">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].name : s.sourceAlbumName}</div>
          <div className="Lh(1) font-weight-bold text-truncate">{s.touhouAlbumIndex > 0 ? touhouAlbum[s.touhouAlbumIndex].songs[s.touhouSongIndex].name : s.sourceSongName}</div>
        </div>
        <div className="B(0) Start(0) Lh(1.15) position-absolute w-100">
          <i className="fa-fw fas fa-sun"></i> {formatNumber(s.avgScore, 0)} <i className="fa-fw fas fa-link"></i> {formatNumber(s.avgCombo, 0)}x <i className="fa-fw fas fa-bullseye"></i> {formatNumber(s.avgAccuracy * 100, 2)}%
        </div>
      </div>
    </div>
  </div>
</div>);

const SortOption = ({query, changeSort, name, sortAsc, sortDesc}) => {
  if (query.sort === sortAsc) {
    return <span className="Cur(p) C($pink) d-inline-block text-nowrap mr-3 mr-lg-4" onClick={() => changeSort(sortAsc, sortDesc)}>{name} <i className="fas fa-caret-up"></i></span>;
  } else if (query.sort === sortDesc) {
    return <span className="Cur(p) C($pink) d-inline-block text-nowrap mr-3 mr-lg-4" onClick={() => changeSort(sortAsc, sortDesc)}>{name} <i className="fas fa-caret-down"></i></span>;
  } else {
    return <span className="Cur(p) text-dark d-inline-block text-nowrap mr-3 mr-lg-4" onClick={() => changeSort(sortAsc, sortDesc)}>{name}</span>;
  }
};

export default class MidiListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);

    this.onSearch = this.onSearch.bind(this);
    this.onChangeAlbum = this.onChangeAlbum.bind(this);
    this.onChangeSong = this.onChangeSong.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);
    this.onLoadPrevPage = this.onLoadPrevPage.bind(this);
    this.onLoadNextPage = this.onLoadNextPage.bind(this);

    const query = this.getQuery();
    this.state = {
      searchInput: query.search,
      midis: [],
      albums: [],
      songs: [],
      isLoading: true,
    };
  }

  getQuery() {
    return queryString.parse(this.props.location.search);
  }

  pushQuery(spec) {
    const query = deleteFalsyKeys({...this.getQuery(), search: this.state.searchInput, ...spec});
    this.props.history.push(this.props.location.pathname + '?' + queryString.stringify(query));
    return query;
  }

  async componentDidMount() {
    const {albumId, songId, status, sort, page, search} = this.getQuery();
    const res = await Promise.all([
      this.app.midiList({albumId, songId, status, sort, page, search}),
      this.app.albumInfoList(),
    ]);
    this.setState({
      isLoading: false,
      midis: res[0],
      albums: res[1],
    });
    if (albumId && songId) {
      await this.app.songList({albumId}).then((songs) => this.setState({songs}));
    }
  }

  async componentWillReceiveProps(props) {
    const {albumId, songId, status, sort, page, search} = queryString.parse(props.location.search);
    this.setState({isLoading: true});
    this.setState({isLoading: false, midis: await this.app.midiList({albumId, songId, status, sort, page, search})});
  }

  onSearch(e) {
    e.preventDefault();
    this.pushQuery({page: undefined});
  }

  async onChangeAlbum(e) {
    const albumId = e.target.value;
    if (albumId === OPTION_ANY) {
      this.pushQuery({page: undefined, albumId: undefined, songId: undefined});
    } else {
      this.pushQuery({page: undefined, albumId, songId: undefined});
      this.setState({songs: await this.app.songList({albumId})});
    }
  }

  async onChangeSong(e) {
    const songId = e.target.value;
    if (songId === OPTION_ANY) {
      this.pushQuery({page: undefined, songId: undefined});
    } else {
      this.pushQuery({page: undefined, songId});
    }
  }

  async onChangeSort(sortAsc, sortDesc) {
    const query = this.getQuery();
    if (query.sort === sortDesc) {
      await this.pushQuery({page: undefined, sort: sortAsc});
    } else {
      await this.pushQuery({page: undefined, sort: sortDesc});
    }
  }

  async onLoadPrevPage() {
    this.pushQuery({page: String(parseInt(String(this.getQuery().page || 0)) - 1)});
  }

  async onLoadNextPage() {
    this.pushQuery({page: String(parseInt(String(this.getQuery().page || 0)) + 1)});
  }

  render() {
    const q = this.getQuery();
    const s = this.state;

    const albumName = s.albums && q.albumId && s.albums.find((x) => x.id === q.albumId)?.name;
    const songName = s.songs && q.songId && s.songs.find((x) => x.id === q.songId)?.name;

    return <div className="container">
      <section className="Bgc($gray-700) P(30px) text-light shadow">

        <form onSubmit={this.onSearch} className="input-group">
          <input className="form-control" type="text" name="searchInput" value={s.searchInput} onChange={this.onChange}/>
          <div className="input-group-append">
            <button type="submit" className="btn btn-secondary"><i className="fas fa-search"></i></button>
          </div>
        </form>

        <div className="small mt-3">
          <div className="d-inline mr-3 mr-md-5">STATUS</div>
          <div className="d-inline">
            <ListingFilterButton active={!q.status} onClick={() => this.pushQuery({status: undefined})} option="any" />
            <ListingFilterButton active={q.status === 'INCLUDED'} onClick={() => this.pushQuery({status: 'INCLUDED'})} option="included" />
            <ListingFilterButton active={q.status === 'APPROVED'} onClick={() => this.pushQuery({status: 'APPROVED'})} option="approved" />
            <ListingFilterButton active={q.status === 'PENDING'} onClick={() => this.pushQuery({status: 'PENDING'})} option="pending" />
            <ListingFilterButton active={q.status === 'DEAD'} onClick={() => this.pushQuery({status: 'DEAD'})} option="dead" />
          </div>
        </div>

        <div className="small mt-1">
          <div className="d-inline mr-2 mr-md-5">ALBUM</div>
          <div className="d-inline Pos(r)">
            <div className='Cur(p) text-light d-inline-block text-nowrap mr-3'>{albumName || 'any'}</div>
            <select className="form-control Pos(a) Cur(p) Start(0) T(0) H(20px) Op(0)" value={q.albumId} onChange={this.onChangeAlbum}>
              <option value={OPTION_ANY}>Any</option>
              {s.albums.map((x) => <option key={x.id} value={x.id}>{x.abbr}: {x.name}</option>)}
            </select>
          </div>
        </div>
        {q.albumId && <div className="small mt-1">
          <div className="d-inline mr-2 mr-md-5">SONG</div>
          <div className="d-inline Pos(r)">
            <div className='Cur(p) text-light d-inline-block text-nowrap mr-3'>{songName || 'any'}</div>
            <select className="form-control Pos(a) Cur(p) Start(0) T(0) H(20px) Op(0)" value={q.songId} onChange={this.onChangeSong}>
              <option value={OPTION_ANY}>Any</option>
              {s.songs.map((x) => <option key={x.id} value={x.id}>{x.track}: {x.name}</option>)}
            </select>
          </div>
        </div>}
      </section>

      <section className="mt-2 mb-3 shadow border">
        <div className="py-2 px-3 border-bottom small">
          <span className="Cur(p) text-nowrap mr-2 mr-lg-5">SORT BY</span>
          <SortOption query={q} changeSort={this.onChangeSort} name="date uploaded" sortAsc="uploadedDate" sortDesc="-uploadedDate" />
          <SortOption query={q} changeSort={this.onChangeSort} name="date approved" sortAsc="approvedDate" sortDesc="-approvedDate" />
          <SortOption query={q} changeSort={this.onChangeSort} name="trials" sortAsc="trialCount" sortDesc="-trialCount" />
          <SortOption query={q} changeSort={this.onChangeSort} name="votes" sortAsc="voteSum" sortDesc="-voteSum" />
          <SortOption query={q} changeSort={this.onChangeSort} name="loves" sortAsc="loveCount" sortDesc="-loveCount" />
          <SortOption query={q} changeSort={this.onChangeSort} name="avg. score" sortAsc="avgScore" sortDesc="-avgScore" />
          <SortOption query={q} changeSort={this.onChangeSort} name="avg. combo" sortAsc="avgCombo" sortDesc="-avgCombo" />
          <SortOption query={q} changeSort={this.onChangeSort} name="avg. accuracy" sortAsc="avgAccuracy" sortDesc="-avgAccuracy" />
        </div>
        <div className="Bgc($gray-100) Px(1.25em) pt-2">
          <div className="row">
            {parseInt(String(q.page)) > 0 && <div className="col-12 mb-2 px-1">
              <button className="btn btn-block btn-outline-secondary" onClick={this.onLoadPrevPage}>load prev page ({parseInt(String(q.page || 0)) - 1})</button>
            </div>}

            {s.isLoading ? <div className="col-12 mb-2 px-1 D(f)">
              <div className="spinner-border mx-auto"></div>
            </div> : s.midis.map((midi) => <Card {...midi} key={midi.id} />)}
            <div className="col-12 mb-2 px-1">
              <button className="btn btn-block btn-outline-secondary" onClick={this.onLoadNextPage}>load next page ({parseInt(String(q.page || 0)) + 1})</button>
            </div>
          </div>
        </div>
      </section>
    </div>;
  }
}
