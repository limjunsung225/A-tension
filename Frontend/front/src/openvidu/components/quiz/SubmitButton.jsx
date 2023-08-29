import React, { Component } from 'react';
import './SubmitButton.css';

class SubmitButton extends Component {
  state = {};

  render() {
    return (
      <div
        onClick={(e) => {
          this.props.result(e);
        }}
        className="buttonContainer"
      >
        <a href="#0" className="btn10">
          <span>제출하기</span>
          <div className="transition"></div>
        </a>
      </div>
    );
  }
}

export default SubmitButton;
