import React from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';

import {formatDate} from '../utils';
import {Translation as Tr} from '../translationService';

class AlbumRow extends React.Component {
  render() {
    const p = this.props;
    return <div className="container-fluid">
      <div className="row shadow" style={{background: `linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url(${p.coverBlurUrl})`, backgroundSize: 'cover'}}>
        <div className="col-md-5">
          <div className="badge badge-pill badge-primary">{formatDate(p.date)}</div>
          <img className="W(100%) rounded shadow-sm" src={p.coverUrl} alt=""/>
          <div>{p.abbr}: <strong>{p.name}</strong> (<Tr ns="name.artifact" src={p.name}/>)</div>
          <div>{p.desc}</div>
          <Link className="btn btn-outline-primary btn-sm" to={{pathname: `/albums/${p._id}/edit`}}>edit</Link>
        </div>
        <div className="col-md-7">
          <ul className="mt-2">
            {p.songs.map((song) => <li className="" key={song._id}>
              <Link className="btn btn-outline-secondary btn-sm" to={{pathname: `/songs/${song._id}/edit`}}>edit</Link> {song.track}: <strong>{song.name}</strong> (<Tr ns="name.artifact" src={song.name}/>) by {song.composer.name}
            </li>)}
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default class AlbumListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      albums: [],
    };
  }

  async componentDidMount() {
    const {page} = queryString.parse(this.props.location.search);
    const albums = await this.app.albumList({page});
    this.setState({albums});
  }

  render() {
    const s = this.state;

    return <div className="container-fluid">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Songs</h2>
      </section>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100)">
          <div className="row">
            {s.albums.map((album) => <AlbumRow {...album} key={album.id} songList={this.songList}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
