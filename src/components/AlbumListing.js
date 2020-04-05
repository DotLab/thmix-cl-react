import React from 'react';

import SongListing from './SongListing';

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
    const albums = await this.app.albumList();
    this.setState({albums});
  }

  render() {
    const s = this.state;

    return <div className="container">
      <section className="Bgc($gray-700) P(30px) text-light shadow">
        <h2 className="row Fw(n)">Songs</h2>
      </section>
      <section className="mt-2 mb-3 shadow border">
        <div className="Bgc($gray-100)">
          <div className="row">
            {s.albums.map((album) => <SongListing {...album} key={album.id} songList={this.songList}/>)}
          </div>
        </div>
      </section>
    </div>;
  }
}
