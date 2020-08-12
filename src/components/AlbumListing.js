import React from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';

import {formatDate} from '../utils';
import {Translation as Tr} from '../translationService';

class AlbumRow extends React.Component {
  render() {
    const p = this.props;
    return <div className="container-fluid Mb(30px) Mx(10px) Mt(10px)">
      <tr>
        <td className="W(10%) Va(t)"><img className="W(90%) rounded shadow-sm" src={p.coverUrl} alt="" />
        </td>
        <table className="P(10px) W(100%)">
          <tr>
            <td className="W(15%) Va(t)"><Link className="btn btn-outline-secondary btn-sm" to={{pathname: `/albums/${p._id}/edit`}}>edit</Link> {p.abbr}: <strong>{p.name}</strong></td>
            <td className="W(35%)"></td>
            <td> <input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="text" onChange={this.onChange} /></td>
            <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="text" onChange={this.onChange} /></td>
            <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="text" onChange={this.onChange} /></td>
            <td><button className="btn btn-primary btn-sm">apply</button></td>
          </tr>
          {p.songs.map((song) => <tr className="" key={song._id}>
            <td className="W(15%)"></td>
            <td className="W(35%)"><Link className="btn btn-outline-secondary btn-sm" to={{pathname: `/songs/${song._id}/edit`}}>edit</Link> {song.track}: <strong>{song.name}</strong></td>
            <td> <input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="text" onChange={this.onChange} /></td>
            <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="text" onChange={this.onChange} /></td>
            <td ><input className="Bdrs(10px) Bdw(1px) D(b) W(90%)" type="text" name="text" onChange={this.onChange} /></td>
            <td><button className="btn btn-primary btn-sm">apply</button></td>
          </tr>)}
        </table>
      </tr>


      {/* <div className="row shadow" style={{ background: `linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url(${p.coverBlurUrl})`, backgroundSize: 'cover' }}>
        <div className="col-md-3">
          <div className="badge badge-pill badge-primary">{formatDate(p.date)}</div>
          <img className="W(100%) rounded shadow-sm" src={p.coverUrl} alt="" />
          <div>{p.abbr}: <strong>{p.name}</strong> (<Tr ns="name.artifact" src={p.name} />)</div>
          <div>{p.desc}</div>
          <Link className="btn btn-outline-primary btn-sm" to={{pathname: `/albums/${p._id}/edit`}}>edit</Link>
        </div>
        <div className="col-md-9">
          <ul className="mt-2">
            {p.songs.map((song) => <li className="" key={song._id}>
              <Link className="btn btn-outline-secondary btn-sm" to={{pathname: `/songs/${song._id}/edit`}}>edit</Link> {song.track}: <strong>{song.name}</strong> (<Tr ns="name.artifact" src={song.name} />) by {song.composer.name}
            </li>)}
          </ul>
        </div>
      </div> */}
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
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="W(10%)">Cover</th>
            <th className="W(13%)">Album</th>
            <th className="W(31%)">Song</th>
            <th>Name ZH</th>
            <th>Name EN</th>
            <th>Name JP</th>
            <th className="W(5%)">action</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
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
