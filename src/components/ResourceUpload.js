import React from 'react';

export default class ResourceUpload extends React.Component {
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

    if (size > 104857600) {
      this.app.error('image too large');
    } else {
      const fr = new FileReader();
      fr.onload = (e) => {
      // @ts-ignore
        const buffer = e.target.result;
        this.app.resourceUpload({name, size, buffer});
      };
      fr.readAsArrayBuffer(e.target.files[0]);
    }
  }

  render() {
    return <div>
      <section className="Bgc(indigo) container px-4 py-4 shadow text-light">
        <h2 className="h3 m-0 font-weight-light">Upload Resource</h2>
      </section>
      <section className="Bgc($gray-800) container mt-2 shadow px-4 py-2 text-light">
        <input className="form-control-file w-auto mx-auto" type="file" accept=".png, .jpeg, .jpg, .ogg" onChange={this.onFileChange}/>
      </section>
    </div>;
  }
}
