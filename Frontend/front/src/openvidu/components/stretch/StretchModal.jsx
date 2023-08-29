import React, { Component } from "react";
import "./StretchModal.css";
class StretchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: this.props.stretchingDisplay,
      toggleStretching: this.props.toggleStretching,
      randomStretch: this.props.randomStretch,
    };
  }

  componentDidUpdate() {
    console.log("this.state.randomStretch : " + this.state.randomStretch);

    if (this.state.display !== this.props.display) {
      this.setState({ display: this.props.display });
    }
    if (this.state.randomStretch !== this.props.randomStretch) {
      this.setState({ randomStretch: this.props.randomStretch });
    }
  }

  close = () => {
    this.props.toggleStretching("close");
    // this.props.toggleQuiz();
  };

  render() {
    return (
      <>
        {this.state.display && (
          <div className="stretchModal">
            <img
              src={`/stretching/stretching${this.state.randomStretch}.gif`}
              alt={"stretchGif"}
            />
          </div>
        )}
      </>
    );
  }
}

export default StretchModal;
