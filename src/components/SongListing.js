import React from 'react';
import {Link} from 'react-router-dom';

import {formatDate} from '../utils';

export default class SongListing extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.state = {
      songs: [],
    };
  }


  async componentDidMount() {
    const songs = await this.props.songList(this.props.id);
    this.setState({songs});
  }

  render() {
    const s = this.state;

    return <div className="container Mb(40px)">
      <div class="D(f)">
        <div>
          <img src={this.props.coverUrl} alt=""/>
          <div>{formatDate(this.props.date)}</div>
          <div>{this.props.abbr && `:`} {this.props.name}</div>
          <div>{this.props.desc}</div>
        </div>
        <div>
          <ul>
            {s.songs.map((song) => <li className="" key={song._id}>{song.name}
              <span class="Mstart(10px)">by {song.composerName[0].name}</span>
              <span class="Mstart(10px)">- {song.track}</span>
              <span class="Mstart(10px)">- {song.desc}</span>
              <Link className="btn btn-secondary Mstart(10px)" to={{pathname: `/songs/${song._id}/edit`}}>edit</Link>
            </li>)}
          </ul>
        </div>
      </div>
    </div>;
  }
}
