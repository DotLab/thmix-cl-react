import React from 'react';
import {Link} from 'react-router-dom';

import {formatDate} from '../utils';

export default class SongListing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const p = this.props;

    return <div className="container">
      <div className="row shadow" style={{background: `linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url(${this.props.coverBlurUrl})`, backgroundSize: 'cover'}}>
        <div className="col-md-5">
          <div className="badge badge-pill badge-primary">{formatDate(this.props.date)}</div>
          <img className="img-fluid rounded shadow-sm" src={this.props.coverUrl} alt=""/>
          <div>{this.props.abbr}: {this.props.name}</div>
          <div>{this.props.desc}</div>
          <Link className="btn btn-outline-primary btn-sm" to={{pathname: `/albums/${this.props._id}/edit`}}>edit</Link>
        </div>
        <div className="col-md-7">
          <ul className="mt-2">
            {p.songs.map((song) => <li className="" key={song._id}>
              <Link className="btn btn-outline-secondary btn-sm" to={{pathname: `/songs/${song._id}/edit`}}>edit</Link> {song.track}: {song.name} by {song.composer.name}
            </li>)}
          </ul>
        </div>
      </div>
    </div>;
  }
}
