import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class CardDetailEdit extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onTextareaChange = onTextareaChange.bind(this);
    this.onCheckboxChange = onCheckboxChange.bind(this);
    this.updateMeta = this.updateMeta.bind(this);
    this.updateMain = this.updateMain.bind(this);
    this.updateParameter = this.updateParameter.bind(this);
    this.validateInput = this.validateInput.bind(this);

    this.state = {
      id: null,

      name: '',
      desc: '',
      rarity: '',
      attribute: '',
      spInit: 0,
      spMax: 0,
      haruInit: 0,
      haruMax: 0,
      reiInit: 0,
      reiMax: 0,
      maInit: 0,
      maMax: 0,
    };
  }

  async componentDidMount() {
    const card = await this.app.cardGet({id: this.props.match.params.id});
    this.setState(card);
  }

  updateMeta() {
    const {id, name, desc} = this.state;
    this.app.cardUpdate({id, name, desc});
  }

  updateMain() {
    const {id, rarity, attribute} = this.state;
    this.app.cardUpdate({id, rarity, attribute});
  }

  updateParameter() {
    const {id, spInit, spMax, haruInit, haruMax,
      reiInit, reiMax, maInit, maMax} = this.state;
    this.app.cardUpdate({id, spInit, spMax, haruInit, haruMax,
      reiInit, reiMax, maInit, maMax});
  }

  validateInput() {
    const s = this.state;
    return {
      spInitField: s.spInit >= 1 && s.spInit <= 4,
      spMaxField: s.spMax >= 1 && s.spMax <= 4,
      haruInitField: s.haruInit >= 1000 && s.haruInit <= 2000,
      haruMaxField: s.haruMax >= 1500 && s.haruMax <= 3000,
      reiInitField: s.reiInit >= 200 && s.reiInit <= 750,
      reiMaxField: s.reiMax >= 400 && s.reiMax <= 1200,
      maInitField: s.maInit >= 200 && s.maInit <= 750,
      maMaxField: s.maMax >= 400 && s.maMax <= 1200,
    };
  }

  render() {
    const s = this.state;
    const inputErrors = this.validateInput();
    const noErrors = !Object.values(inputErrors).some((x) => x === false);

    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Card</strong> Detail</h2>
      </section>

      <Block>
        <Block.Left><h2 className="h5 m-0">Meta</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">card name</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="name" value={s.name} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">card description</label>
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
      <Block>
        <Block.Left><h2 className="h5 m-0">Main</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">card rarity</label>
            <div className="col-sm-9">
              <select className="form-control" name="rarity" value={s.rarity} onChange={this.onChange}>
                <option value="N">N</option>
                <option value="R">R</option>
                <option value="SR">SR</option>
                <option value="UR">UR</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">card attribute</label>
            <div className="col-sm-9">
              <select className="form-control" name="attribute" value={s.attribute} onChange={this.onChange}>
                <option value="haru">Haru</option>
                <option value="rei">Rei</option>
                <option value="ma">Ma</option>
              </select>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateMain}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
      <Block>
        <Block.Left><h2 className="h5 m-0">Parameters</h2></Block.Left>
        <Block.Right>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">Initial SP</label>
            <div className="col-sm-9"><input className="form-control" type="number" name="spInit" value={s.spInit} min={1} max={4} onChange={this.onChange}/>
              <small className="form-text">range [1, 4]</small>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">Max SP</label>
            <div className="col-sm-9"><input className="form-control" type="number" name="spMax" value={s.spMax} onChange={this.onChange}/>
              <small className="form-text">range [1, 4]</small>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">Initial Haru</label>
            <div className="col-sm-9"><input className="form-control" type="number" name="haruInit" value={s.haruInit} onChange={this.onChange}/>
              <small className="form-text">range [1000, 2000]</small>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">Max Haru</label>
            <div className="col-sm-9"><input className="form-control" type="number" name="haruMax" value={s.haruMax} onChange={this.onChange}/>
              <small className="form-text">range [1500, 3000]</small>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">Initial Rei</label>
            <div className="col-sm-9"><input className="form-control" type="number" name="reiInit" value={s.reiInit} onChange={this.onChange}/>
              <small className="form-text">range [200, 750]</small>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">Max Rei</label>
            <div className="col-sm-9"><input className="form-control" type="number" name="reiMax" value={s.reiMax} onChange={this.onChange}/>
              <small className="form-text">range [400, 1200]</small>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">Initial Ma</label>
            <div className="col-sm-9"><input className="form-control" type="number" name="maInit" value={s.maInit} onChange={this.onChange}/>
              <small className="form-text">range [200, 750]</small>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">Max Ma</label>
            <div className="col-sm-9"><input className="form-control" type="number" name="maMax" value={s.maMax} onChange={this.onChange}/>
              <small className="form-text">range [400, 1200]</small>
            </div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" disabled={!noErrors} onClick={this.updateParameter}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
    </div>;
  }
}
