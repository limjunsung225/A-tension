import React, { Component } from "react";
import * as faceApi from "@vladmandic/face-api";
import LoadingBar from "./components/items/LoadingBar";
import Smile from "./assets/images/giphy_smile.gif";
import Warning from "./components/toolbar/iconComponents/img/warningIcon.png";

export default class FaceDetection extends Component {
  video = React.createRef();

  state = {
    expressions: 0,
    face: 0,
    smile: 0,
    normal: 0,
    autoPlay: false,
    camera: true,
    concentration: 0,
    last: 1,
  };

  componentDidMount() {
    this.run();
  }

  componentDidUpdate() {
    if (this.state.autoPlay !== this.props.autoPlay) {
      this.setState({
        autoPlay: this.props.autoPlay,
        face: 0,
        smile: 0,
        normal: 0,
        concentration: 0,
        last: 1,

      });
    }
    if (this.state.camera !== this.props.camera) {
      this.setState({
        camera: this.props.camera,
        face: 0,
        smile: 0,
        normal: 0,
        concentration: 0,
        last: 1,

      });
    }
  }

  log = (...args) => {
    console.log(...args);
  };

  run = async () => {
    this.log("run started");
    try {
      await faceApi.nets.tinyFaceDetector.load("/models");
      await faceApi.loadFaceExpressionModel(`/models`);
      await faceApi.loadFaceLandmarkModel(`/models`);
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      this.video.current.srcObject = this.mediaStream;
    } catch (e) {
      this.log(e.name, e.message, e.stack);
    }
  };

  onPlay = async () => {
    if (
      !this.state.autoPlay ||
      this.state.camera ||
      this.video.current.paused ||
      this.video.current.ended ||
      !faceApi.nets.tinyFaceDetector.params
    ) {
      setTimeout(() => this.onPlay());
      return;
    }

    const options = new faceApi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.5,
    });

    const result = await faceApi
      .detectSingleFace(this.video.current, options)
      .withFaceLandmarks()
      .withFaceExpressions();
    if (!result) {
      console.log("사용자가 집중하지 않습니다.");
      // this.props.concentration = 0;
      this.props.concentrationEvent(0);
      // this.setState(() => ({ concentration: 0}));
    }
    if (result) {
      console.log(result);
      const pitch = result.angle.pitch;
      const yaw = result.angle.yaw;
      if (pitch < -15 || Math.abs(yaw) > 90 || (yaw < 40 && pitch < -10)) {
        console.log("사용자가 집중하지 않습니다.");
        this.props.concentrationEvent(0);
        // this.setState(() => ({ concentration: 0}));
      }
      // 0점 부여
      else if (0 < pitch < 10 && yaw < 30) {
        console.log("매우 잘 집중 중입니다.");
        this.props.concentrationEvent(2);
        // this.setState(() => ({ concentration: 2}));

        // 2점 부여
      } else {
        console.log("집중 중입니다.");
        this.props.concentrationEvent(1);
        // this.setState(() => ({ concentration: 1}));

        // 1점 부여
      }

      const happy = result.expressions.happy;
      let normal = this.state.normal;
      let smile = this.state.smile;
      this.setState(() => ({ expressions: happy, face: 0 }));

      if (happy > 0.8) {
        normal = 0;
        smile += 1;
        if (smile === 3) {
          this.props.smile(true);
          this.state.last = 0;
          this.props.concentrationEvent(3);
          // if (last === 1) { // normal에서 웃음
          //   this.props.concentrationEvent(3);
          // }
          // else { // 자리비움에서 웃음
          //   this.props.concentrationEvent(4);
          // }
        }
      } else {
        smile = 0;
        normal += 1;
        if (normal === 3) {
          this.props.smile(false);
          this.state.last = 1;
          this.props.concentrationEvent(4);

          // if (last === 0) { // 웃다가 normal
          //   this.props.concentrationEvent(5);
          // }
          // else { // 자리비웠다가 normal
          //   this.props.concentrationEvent(6);
          // }
        }
      }
      this.props.outAngle(false);
      this.setState(() => ({ smile: smile, normal: normal }));
    } else {
      const lv = this.state.face + 1;
      this.props.smile(false);
      this.setState(() => ({ expressions: 0, face: lv }));
      if (lv === 6) {
        this.props.outAngle(true);
        this.state.last = 2;
        this.props.concentrationEvent(5);
        // if (last === 0) { // 웃다가 자리비움
        //   this.props.concentrationEvent(7);
        // }
        // else { // normal에서 자리비움
        //   this.props.concentrationEvent(8);
        // }
      }
    }
    setTimeout(() => this.onPlay(), 300);
  };

  render() {
    return (
      <div
        className="FaceDetection"
        style={{ position: "relative", height: "95%", width: "98%" }}
      >
        {!this.props.camera || this.state.autoPlay ? (
          <>
            <h1
              style={{
                position: "absolute",
                bottom: "5%",
                left: "2.5%",
                fontSize: "500%",
              }}
            >
              {this.state.smile < 1 ? null : this.state.smile > 3 ? (
                <img
                  style={{
                    position: "absolute",
                    minWidth: "8rem",
                    width: "20%",
                    minHeight: "8rem",
                    height: "20%",
                    bottom: "5%",
                    left: "2.5%",
                  }}
                  src={Smile}
                  alt={"HI"}
                ></img>
              ) : (
                <div />
              )}
            </h1>
            <h1
              style={{
                position: "absolute",
                bottom: "5%",
                left: "2.5%",
                fontSize: "500%",
              }}
            >
              {this.state.face < 3 ? null : this.state.face > 5 ? (
                <img
                  src={Warning}
                  style={{ width: "100px", height: "100px" }}
                />
              ) : (
                <div />
              )}
            </h1>
            <div style={{ width: "0px", height: "0px" }}>
              <video ref={this.video} autoPlay muted onPlay={this.onPlay} />
            </div>
          </>
        ) : null}
      </div>
    );
  }
}
