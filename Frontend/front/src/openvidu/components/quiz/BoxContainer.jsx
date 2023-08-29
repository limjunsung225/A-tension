import React, { Component } from 'react';
import './BoxContainer.css';

class BoxContainer extends Component {
  state = {
    color: this.props.color,
    answer: this.props.answer,
    activate: this.props.activate,
  };

  componentDidUpdate() {
    if (this.props.activate !== this.state.activate) {
      this.setState({ activate: this.props.activate });
    }
  }

  render() {
    return (
      <button
        value={this.props.id}
        onClick={(e) => this.props.select(e)}
        style={{ backgroundColor: `${this.state.color}` }}
        className={this.state.activate ? 'boxActivate' : 'box'}
      >
        <h1 className="answer">{this.props.answer}</h1>
      </button>
    );
  }
}

export default BoxContainer;
