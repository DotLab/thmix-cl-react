import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';
import NoImageAvailable from './NoImageAvailable.jpg';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class ResourceDetailEdit extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onTextareaChange = onTextareaChange.bind(this);
    this.onCheckboxChange = onCheckboxChange.bind(this);
    this.updateMeta = this.updateMeta.bind(this);

    this.state = {
      id: null,

      name: '',
      type: '',
      desc: '',
      hash: '',
      path: '',
      url: '',
      uploaderId: null,
      uploadedDate: null,
      approvedDate: null,
      status: '',
      tags: null,
    };
  }

  async componentDidMount() {
    const resource = await this.app.resourceGet({id: this.props.match.params.id});
    this.setState(resource);
  }

  updateMeta() {
    const {id, name, desc} = this.state;
    this.app.resourceUpdate({id, name, desc});
  }

  render() {
    const s = this.state;
    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Resource</strong> Detail</h2>
      </section>

      {s.type === 'image' && <Block>
        <Block.Left><h2 className="h5 m-0">Content</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9">
              <img className="H(256px) shadow-sm rounded" src={s.url || NoImageAvailable} alt=""/>
            </div>
          </div>
        </Block.Right>
      </Block>}
      <Block>
        <Block.Left><h2 className="h5 m-0">Meta</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">resource type</label>
            <div className="col-sm-3 col-form-label">{s.type}</div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">resource name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">resource description</label>
            <div className="col-sm-9">
              <textarea className="form-control" value={s.desc} name="desc" rows={this.state.descRowCount} onChange={this.onTextareaChange}/>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateMeta}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
    </div>;
  }
}
