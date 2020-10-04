import React from 'react';

export default class EditableText extends React.Component {
  constructor(props) {
    super(props);
    this.spanRef = React.createRef();
    this.updateText = this.updateText.bind(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (document.activeElement !== this.spanRef.current) {
      this.spanRef.current.innerText = String(props.text);
    }
  }

  async updateText() {
    const text = this.spanRef.current.innerText;
    if (text !== String(this.props.text)) {
      if (!await this.props.updateText(text)) {
        if (!this.spanRef.current) return;
        this.spanRef.current.innerText = String(this.props.text);
      }
    }
  }

  render() {
    return React.createElement(this.props.e || 'span', {
      className: this.props.className,
      ref: this.spanRef,
      contentEditable: 'true',
      suppressContentEditableWarning: true,
      onBlur: this.updateText,
    }, [String(this.props.text)]);
  }
}
