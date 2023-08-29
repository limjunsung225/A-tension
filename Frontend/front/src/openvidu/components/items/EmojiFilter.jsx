import React, { Component } from "react";
import Smile from "../../assets/images/giphy_smile.gif";
import Warning from "../toolbar/iconComponents/img/warningIcon.png";

export default class EmojiFilter extends Component {
  constructor(props) {
    super(props);
    this.state = { user: this.props.user };
  }

  render() {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {!this.state.user.screenShareActive && this.state.user.videoActive ? (
          <>
            {this.state.user.smile ? (
              <img
                style={{
                  minWidth: "6rem",
                  width: "15%",
                  position: "absolute",
                  bottom: "5%",
                  left: "2.5%",
                }}
                src={Smile}
                alt={"HI"}
              ></img>
            ) : null}
            {this.props.whoami === "teacher" && (
              <h1
                style={{
                  position: "absolute",
                  bottom: "5%",
                  left: "2.5%",
                  fontSize: "500%",
                }}
              >
                {this.state.user.outAngle ? "⚠️" : null}
              </h1>
            )}
          </>
        ) : null}
      </div>
    );
  }
}
