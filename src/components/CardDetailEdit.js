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

    this.state = {
      id: null,

      name: '',
      desc: '',
      rarity: '',
      attribute: '',
      sp_init: 0,
      sp_max: 0,
      haru_init: 0,
      haru_max: 0,
      rei_init: 0,
      rei_max: 0,
      ma_init: 0,
      ma_max: 0,
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
    const {id, sp_init, sp_max, haru_init, haru_max,
      rei_init, rei_max, ma_init, ma_max} = this.state;
    this.app.cardUpdate({id, sp_init, sp_max, haru_init, haru_max,
      rei_init, rei_max, ma_init, ma_max});
  }

  render() {
    const s = this.state;
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
            <label className="col-sm-3 col-form-label text-right">sp init</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="sp_init" value={s.sp_init} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">sp max</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="sp_max" value={s.sp_max} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">haru init</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="haru_init" value={s.haru_init} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">haru max</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="haru_max" value={s.haru_max} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">rei init</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="rei_init" value={s.rei_init} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">rei max</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="rei_max" value={s.rei_max} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">ma init</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="ma_init" value={s.ma_init} onChange={this.onChange}/></div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-right">ma max</label>
            <div className="col-sm-9"><input className="form-control" type="text" name="ma_max" value={s.ma_max} onChange={this.onChange}/></div>
          </div>
          <hr/>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9"><button className="btn btn-primary" onClick={this.updateParameter}>Update</button></div>
          </div>
        </Block.Right>
      </Block>
    </div>;
  }
}
