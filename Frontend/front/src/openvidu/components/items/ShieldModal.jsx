import React, { Component } from "react";
import "./ShieldModal.css";

// const shieldImg = require('@src/assets/images/freepassTicket.png');

class ShieldModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: this.props.display,
      countDown: this.props.timeOut,
    };
    this.close = this.close.bind(this);
    this.count = this.count.bind(this);
    this.upPresentationCnt = this.upPresentationCnt.bind(this);
  }

  componentDidUpdate() {
    if (this.state.display !== this.props.display) {
      this.setState({ display: this.props.display });
      this.setState({ countDown: this.props.timeOut });
      this.count();
    }
  }

  useShield = async () => {
    // itemId:3 발표 프리패스
    const cnt = await this.props.checkUserHasItem(3);
    if (cnt > 0) {
      this.props.alertToChat(
        this.props.user.nickname + "님이 발표 프리패스를 사용했습니다!"
      );
      this.props.pickRandomStudent(this.props.subscribers, true);
      this.props.useItem(3);
      this.close();
    } else {
      alert("보유한 발표 프리패스가 없습니다!");
    }
  };

  notUseShield = () => {
    // this.props.tempFrameChange({ type: "color", value: "Red" });
    this.upPresentationCnt();
    this.props.tempFrameChange({
      type: "style",
      value: {
        animation: "alertFrame 3s linear 1",
      },
    });
    this.close();
  };

  upPresentationCnt = () => {
    this.props.upPresentationCnt();
  };

  close() {
    this.props.toggleShield();
  }

  count() {
    let interval = setInterval(() => {
      this.setState({ countDown: this.state.countDown - 1 });
    }, 1000);
    setTimeout(() => {
      if (this.state.display === true) {
        this.notUseShield();
      }
      clearInterval(interval);
    }, this.props.timeOut * 1000);
  }

  render() {
    return (
      <div className={this.state.display ? "openModal modal" : "modal"}>
        {this.state.display ? (
          <section>
            <header>{this.props.header}</header>
            <div>
              <div id="content">
                <img
                  id="shieldIcon"
                  src={shieldImg}
                  alt="발표 프리패스 이미지"
                />
                <h1>발표 프리패스를 사용 하시겠습니까?</h1>
                <p>({this.state.countDown})초 남음</p>
                <button
                  className="choice"
                  id="shield-yes"
                  onClick={this.useShield}
                >
                  예
                </button>
                <button
                  className="choice"
                  id="shield-no"
                  onClick={this.notUseShield}
                >
                  아니오
                </button>
              </div>
            </div>
            <footer></footer>
          </section>
        ) : null}
      </div>
    );
  }
}

export default ShieldModal;
