import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';
import {rpc} from '../apiService';
import {FormFieldCoverInput, FormField} from './FormField';

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
    this.validateInput = this.validateInput.bind(this);
    this.onCoverChange = this.onCoverChange.bind(this);

    this.state = {
      id: null,

      name: '',
      desc: '',
      picSource: '',
      picAuthorName: '',
      rarity: '',
      portraitUrl: '',
      coverUrl: '',
      backgroundUrl: '',
      iconUrl: '',

      // attribute: '',
      // spInit: 0,
      // spMax: 0,
      // haruInit: 0,
      // haruMax: 0,
      // reiInit: 0,
      // reiMax: 0,
      // maInit: 0,
      // maMax: 0,
    };
  }

  async componentDidMount() {
    const card = await rpc('ClWebCardGet', {id: this.props.match.params.id});
    this.setState(card);
  }

  async updateMeta() {
    const {id, name, desc, picSource, picAuthorName} = this.state;
    await rpc('ClWebCardUpdate', {id, name, desc, picSource, picAuthorName});
  }

  async updateMain() {
    const {id, rarity, attribute} = this.state;
    await rpc('ClWebCardUpdate', {id, rarity, attribute});
  }

  onCoverChange(e, type) {
    if (!e.target.files[0]) return;

    const size = e.target.files[0].size;
    if (size > 6048576) {
      this.app.error('image too large');
    } else {
      const fr = new FileReader();
      fr.onload = (e) => {
        // @ts-ignore
        const buffer = e.target.result;
        rpc('ClWebCardUploadCover', {id: this.state.id, size, buffer, type}).then((card) => this.setState(card));
      };
      fr.readAsArrayBuffer(e.target.files[0]);
    }
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

    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Card</strong> Detail</h2>
      </section>
      <Block>
        <Block.Left><h2 className="h5 m-0">Cover</h2></Block.Left>
        <Block.Right>
          <FormFieldCoverInput label="portrait" accept="image/* .png .jpg" coverUrl={s.portraitUrl} onChange={(e) => this.onCoverChange(e, 'portrait')}/>
        </Block.Right>
      </Block>
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
          <FormField label="picture source" name="picSource" value={s.picSource} onChange={this.onChange}/>
          <FormField label="picture author name" name="picAuthorName" value={s.picAuthorName} onChange={this.onChange}/>
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
                <option value="n">N</option>
                <option value="r">R</option>
                <option value="sr">SR</option>
                <option value="ur">UR</option>
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
    </div>;
  }
}
