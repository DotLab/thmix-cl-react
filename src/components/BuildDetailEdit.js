import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class MidiDetailEdit extends React.Component {
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

      build: 0,
      version: '',
      name: 5,
      desc: '',
      path: '',
      url: '',
      descRowCount: 8,
    };
  }

  async componentDidMount() {
    const build = await this.app.buildGet({id: this.props.match.params.id});
    this.setState(build);
  }

  updateMeta() {
    const {id, build, version, name, desc} = this.state;
    this.app.buildUpdate({id, build, version, name, desc});
  }

  render() {
    const s = this.state;
    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Build</strong> Detail</h2>
      </section>
      <Block>
        <Block.Left><h2 className="h5 m-0">Meta</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">build url</label>
            <div className="col-sm-9"><a href={s.url} className="Td(n) C(white)">{s.url}</a></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">build name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">build description</label>
            <div className="col-sm-9">
              <textarea className="form-control" value={s.desc} name="desc" rows={this.state.descRowCount} onChange={this.onTextareaChange}/>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">build version</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="version" value={s.version} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">build number</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="build" value={s.build} onChange={this.onChange}/></div>
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
