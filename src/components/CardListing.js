import React from 'react';

import {Header} from './Header';
import {rpc} from '../apiService';


export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
    };
  }

  async componentDidMount() {
    const cards = await rpc('cl_web_cards_listing');
    this.setState({cards});
  }

  render() {
    return <div className="container">
      <Header title="Cards"/>

    </div>;
  }
}
