import React from 'react';
import {Link} from 'react-router-dom';
import backgroundImage from './background.png';
import soundImage from './sound.jpg';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      audio: new Audio(this.props.url),
      duration: null,
    };
    this.play = this.play.bind(this);
  }

  async componentDidMount() {
    const audio = this.state.audio;
    audio.addEventListener('loadeddata', () => {
      const duration = audio.duration;
      this.setState({duration});
    });

    audio.addEventListener('ended', () => {
      const playing = false;
      this.setState({playing});
    });
  }

  componentWillUnmount() {
    if (this.state.audio) {
      this.state.audio.pause();
    }
  }

  play(e) {
    e.preventDefault();
    const playing = !(this.state.playing);
    if (this.state.audio) {
      if (!this.state.playing) {
        this.state.audio.play();
      } else {
        this.state.audio.pause();
      }
      this.setState({playing});
    }
  }

  render() {
    const s = this.props;
    const playing = this.state.playing;
    const canEdit = this.props.app.state.user && this.props.uploaderId === this.props.app.state.user.id;

    return <div className="col-md-3 mb-2 px-1">
      <div className="H(250px) bg-light rounded shadow-sm border" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)), url(${backgroundImage})`}}>
        {s.type === 'image' && <div className="H(200px) Bgp(c) Bgz(ct) rounded-top text-light p-2" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)), url(${s.url})`}}>
          <div className="position-relative w-100 h-100">
            {canEdit && <div className="T(0) Start(0) position-absolute small"><Link className="badge badge-lg badge-pill badge-dark p-2 shadow" to={{pathname: `/resources/${s.id}/edit`}}>Edit</Link></div>}
            <div className="B(0) Start(0) Lh(1.15) position-absolute font-italic w-100">
              <div className="h5 m-0 text-light text-truncate">{s.name}</div>
              <div>{s.artistName}</div>
            </div>
          </div>
        </div>}
        {s.type === 'sound' && <div className="H(200px) Bgp(c) Bgz(ct) rounded-top text-light p-2" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .5)), url(${soundImage})`}}>
          <div className="position-relative w-100 h-100">
            {canEdit && <div className="T(0) Start(0) position-absolute small"><Link className="badge badge-lg badge-pill badge-dark p-2 shadow" to={{pathname: `/resources/${s.id}/edit`}}>Edit</Link></div>}
            <div className="T(20%) End(34%) Fz(60px) position-absolute text-right" onClick={this.play}>
              {!playing && <i class="fas fa-play-circle"></i>}
              {playing && <i class="fas fa-pause-circle"></i>}
            </div>
            <div className="B(0) Start(0) Lh(1.15) position-absolute font-italic w-100">
              <div className="h5 m-0 text-light text-truncate">{s.name}</div>
              <div>{s.artistName}</div>
            </div>
          </div>
        </div>}
        <div className="H(50px) p-2 small Bgc(white)">
          <div className="position-relative w-100 h-100">
            <div className="T(0) Start(0) Lh(1.15) position-absolute w-100">
              <div className="small font-weight-bold">uploaded by <Link to={`/users/${s.uploaderId}`}>{s.uploaderName}</Link></div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
