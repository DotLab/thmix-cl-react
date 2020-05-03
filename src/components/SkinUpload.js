import React from 'react';
import {FormFieldCoverInput} from './FormField';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);


export default class SkinUpload extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onFileChange = this.onFileChange.bind(this);
  }

  async onFileChange(e) {
    if (!e.target.files[0]) return;

    const name = e.target.files[0].name;
    const size = e.target.files[0].size;

    if (size > 1048576) {
      this.app.error('image too large');
    } else {
      const fr = new FileReader();
      fr.onload = (e) => {
      // @ts-ignore
        const buffer = e.target.result;
        this.app.midiUpload({name, size, buffer});
      };
      fr.readAsArrayBuffer(e.target.files[0]);
    }
  }

  render() {
    return <div>
      <section className="Bgc(indigo) container px-4 py-4 shadow text-light">
        <h2 className="h3 m-0 font-weight-light">Upload skin</h2>
      </section>
      <section className="Bgc($gray-800) container mt-2 shadow px-4 py-2 text-light">
        <Block>
          <Block.Left><h2 className="h5 m-0">Skin suite</h2></Block.Left>
          <Block.Right>
            <FormFieldCoverInput label="instant block *" onChange={this.onFileChange}/>
            <FormFieldCoverInput label="instant connect" onChange={this.onFileChange}/>
            <FormFieldCoverInput label="short block *" onChange={this.onFileChange}/>
            <FormFieldCoverInput label="short connect" onChange={this.onFileChange}/>
            <FormFieldCoverInput label="long block fill *" onChange={this.onFileChange}/>
            <FormFieldCoverInput label="long block top" onChange={this.onFileChange}/>
            <FormFieldCoverInput label="long block bottom" onChange={this.onFileChange}/>


          </Block.Right>
        </Block>
      </section>
    </div>;
  }
}
