import React from 'react';
import {Link} from 'react-router-dom';

import {formatDate} from '../utils';

export default class SongListing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const p = this.props;

    return <div className="container Mb(40px)">
      <div className="row">
        <div className="col-4">
          <img src={this.props.coverUrl} alt=""/>
          <div>{this.props.abbr}: {this.props.name}</div>
          <div>{formatDate(this.props.date)}</div>
          <div>{this.props.desc}</div>
          <Link className="btn btn-primary btn-sm" to={{pathname: `/albums/${this.props._id}/edit`}}>edit</Link>
        </div>
        <div className="col-8">
          <ul>
            {p.songs.map((song) => <li className="" key={song._id}>
              {song.track}: {song.name} by {song.composer.name}
              <Link className="btn btn-primary btn-sm Mstart(10px)" to={{pathname: `/songs/${song._id}/edit`}}>edit</Link>
            </li>)}
          </ul>
        </div>
      </div>
    </div>;
  }
}
