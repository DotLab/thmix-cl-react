import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';
import {rpc} from '../apiService';
import {FormFieldImageUpload} from './FormField';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class EventDetailEdit extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onTextareaChange = onTextareaChange.bind(this);
    this.onCheckboxChange = onCheckboxChange.bind(this);
    this.updateMeta = this.updateMeta.bind(this);
    this.updateMidi = this.updateMidi.bind(this);
    this.onCoverChange = this.onCoverChange.bind(this);

    this.state = {
      id: this.props.match.params.id,

      name: '',
      desc: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      coverUrl: '',
      midis: '',
    };
  }

  async componentDidMount() {
    const event = await rpc('ClWebEventGet', {id: this.props.match.params.id});
    this.setState(event);
    const startDate = event.startDate ? event.startDate.split('T')[0] : null;
    const endDate = event.endDate ? event.endDate.split('T')[0] : null;
    const midis = event.midiIds.join('\n');
    this.setState({startDate, endDate, midis});
  }

  async updateMeta() {
    const {id, startDate, endDate, name, desc, midiIds} = this.state;
    await rpc('ClWebEventUpdate', {id, startDate, endDate, name, desc, midiIds});
    this.app.success('event updated');
  }

  async updateMidi() {
    const midiIds = this.state.midis.split('\n');
    await rpc('ClWebEventUpdate', {id: this.state.id, midiIds});
    this.app.success('event updated');
  }

  onCoverChange(e) {
    if (!e.target.files[0]) return;

    const size = e.target.files[0].size;
    if (size > 6048576) {
      this.app.error('image too large');
    } else {
      const fr = new FileReader();
      fr.onload = (e) => {
        // @ts-ignore
        const buffer = e.target.result;
        rpc('ClWebEventUploadCover', {id: this.state.id, size, buffer}).then((event) => this.setState(event));
      };
      fr.readAsArrayBuffer(e.target.files[0]);
    }
  }

  render() {
    const s = this.state;

    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Event</strong> Detail</h2>
      </section>
      <Block>
        <Block.Left><h2 className="h5 m-0">Cover</h2></Block.Left>
        <Block.Right>
          <FormFieldImageUpload label="cover" accept="image/* .png .jpg" coverUrl={s.coverUrl} onChange={(e) => this.onCoverChange(e, 'cover')}/>
        </Block.Right>
      </Block>
      <Block>
        <Block.Left><h2 className="h5 m-0">Meta</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">event name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">event description</label>
            <div className="col-sm-9">
              <textarea className="form-control" value={s.desc} name="desc" rows={8} onChange={this.onTextareaChange}/>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">start date</label>
            <div className="col-sm-9"><input className="form-control" type="date" name="startDate" value={s.startDate || new Date().toISOString().split('T')[0]} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">end date</label>
            <div className="col-sm-9"><input className="form-control" type="date" name="endDate" value={s.endDate || new Date().toISOString().split('T')[0]} onChange={this.onChange}/></div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateMeta}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
      <Block>
        <Block.Left><h2 className="h5 m-0">Midis</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">midi list</label>
            <div className="col-sm-9">
              <textarea className="form-control" value={s.midis} name="midis" rows={9} onChange={this.onTextareaChange}/>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateMidi}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
    </div>;
  }
}
