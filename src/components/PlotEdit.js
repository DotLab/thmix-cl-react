import React from 'react';

import {onTextareaChange, onChange, onCheckboxChange} from '../utils';
import {rpc} from '../apiService';
import {FormField, FormFieldTextArea, FormFieldButton} from './FormField';

const Block = ({children}) => (<section className="container px-md-5 mb-2"><div className="row text-light">{children}</div></section>);
Block.Left = ({children}) => (<div className="Bgc($gray-700) shadow col-lg-3 py-3 pl-4 font-italic">{children}</div>);
Block.Right = ({children}) => (<div className="Bgc($gray-600) shadow col-lg-9 pt-3">{children}</div>);

export default class PlotEdit extends React.Component {
  constructor(props) {
    super(props);

    /** @type {import('../App').default} */
    this.app = props.app;

    this.onChange = onChange.bind(this);
    this.onTextareaChange = onTextareaChange.bind(this);
    this.onCheckboxChange = onCheckboxChange.bind(this);
    this.update = this.update.bind(this);

    this.state = {
      id: null,

      title: '',
      script: '',
    };
  }

  async componentDidMount() {
    const plot = await rpc('onClWebPlotGet', {id: this.props.match.params.id});
    this.setState(plot);
  }

  async update() {
    const {id, title, script} = this.state;
    await rpc('ClWebPlotUpdate', {id, title, script});
    this.app.success('plot updated');
  }

  render() {
    const s = this.state;
    return <div>
      <section className="Bgc($gray-800) container text-light px-5 pb-3 pt-5">
        <h2 className="font-weight-light m-0"><strong className="font-weight-normal">Plot</strong> Detail</h2>
      </section>

      <Block>
        <Block.Left><h2 className="h5 m-0">Main</h2></Block.Left>
        <Block.Right>
          <FormField label="title" name="title" value={s.title} onChange={this.onChange}/>
          <FormFieldTextArea label="script" name="script" value={s.script} onChange={this.onTextareaChange}/>
          <FormFieldButton label="Save" onClick={this.update}/>
        </Block.Right>
      </Block>
    </div>;
  }
}
