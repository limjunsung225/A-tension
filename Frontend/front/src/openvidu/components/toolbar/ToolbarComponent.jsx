import React, { Component } from "react";
import "./ToolbarComponent.css";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Fullscreen from "@material-ui/icons/Fullscreen";
import FullscreenExit from "@material-ui/icons/FullscreenExit";
import PictureInPicture from "@material-ui/icons/PictureInPicture";
import StopScreenShare from "@material-ui/icons/StopScreenShare";
import IconButton from "@material-ui/core/IconButton";
import ViewAgenda from "@material-ui/icons/ViewAgenda";
import ViewArray from "@material-ui/icons/ViewArray";
import Share from "@material-ui/icons/Share";
import ChatIcon from "./iconComponents/ChatIcon";
import EmojiIcon from "./iconComponents/EmojiIcon";
import GameIcon from "./iconComponents/GameIcon";
import ScreenIcon from "./iconComponents/ScreenIcon";
import OneIcon from "./iconComponents/OneIcon";
import QuestionMarkIcon from "./iconComponents/QuestionMarkIcon";
import SeperateIcon from "./iconComponents/SeperateIcon";
import SettingIcon from "./iconComponents/SettingIcon";
import ExitIcon from "./iconComponents/ExitIcon";
import SoundIcon from "./iconComponents/SoundIcon";
import MuteIcon from "./iconComponents/MuteIcon";
import VideoIcon from "./iconComponents/VideoIcon";
import NoVideoIcon from "./iconComponents/NoVideoIcon";
import TeachersToolbar from "./TeachersToolbar";
import ConcentrationIcon from "./iconComponents/ConcentrationIcon";

export default class ToolbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      randAvailable: true,
      stickerAvailable: true,
      showTeacherMenuToggle: false,
      teacherMenuToggle: false,
      mySessionId: this.props.sessionId,
    };
    this.camStatusChanged = this.camStatusChanged.bind(this);
    this.micStatusChanged = this.micStatusChanged.bind(this);
    this.screenShare = this.screenShare.bind(this);
    this.stopScreenShare = this.stopScreenShare.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.toggleQuiz = this.toggleQuiz.bind(this);
    this.pickRandomStudent = this.pickRandomStudent.bind(this);
    this.startStickerEvent = this.startStickerEvent.bind(this);
    this.toggleSetting = this.toggleSetting.bind(this);
    this.selfLeaveSession = this.selfLeaveSession.bind(this);
    this.toggleVideoLayout = this.toggleVideoLayout.bind(this);
    this.toggleEmoji = this.toggleEmoji.bind(this);
    this.toggleQuestion = this.toggleQuestion.bind(this);
    this.toggleTeacherMenu = this.toggleTeacherMenu.bind(this);
    this.toggleConcentrationMenu = this.toggleConcentrationMenu.bind(this);
    this.toggleStretching = this.toggleStretching.bind(this);
  }

  // micStatusChanged: 마이크 상태변화 토글 함수
  micStatusChanged() {
    this.props.micStatusChanged();
  }

  // camStatusChanged: 캠 상태변화 토글 함수
  camStatusChanged() {
    this.props.camStatusChanged();
  }

  // screenShare: 스크린쉐어 시작 함수
  screenShare() {
    this.props.screenShare();
  }

  // screenShare: 스크린쉐어 중지 함수
  stopScreenShare() {
    this.props.stopScreenShare();
  }

  // toggleFullscreen: 전체화면 토글 버튼
  toggleFullscreen() {
    this.setState({ fullscreen: !this.state.fullscreen });
    this.props.toggleFullscreen();
  }

  // leaveSession: 세션 이탈 함수
  leaveSession() {
    this.props.leaveSession();
  }

  // selfLeaveSession: 혼자 세션 이탈 함수
  selfLeaveSession() {
    this.props.selfLeaveSession();
  }

  // toggleChat: 채팅 토글 함수
  toggleChat() {
    this.props.toggleChat();
  }

  toggleSetting() {
    this.props.toggleSetting();
  }

  toggleEmoji() {
    this.props.toggleEmoji();
  }

  toggleQuestion() {
    this.props.toggleQuestion();
  }

  toggleQuiz() {
    this.props.toggleQuiz();
  }

  pickRandomStudent() {
    this.lockOut(6);
    this.props.pickRandomStudent(this.props.subscribers, false);
  }

  lockOut(lockOutTime) {
    this.setState({ randAvailable: false });
    setTimeout(() => {
      this.setState({ randAvailable: true });
    }, lockOutTime * 1000);
  }

  // lockOutSticker: 호출 시 칭찬스티커 버튼을 지정된 시간 (15초) 동안 disabled 해주는 함수
  lockOutSticker(lockOutTime) {
    this.setState({ stickerAvailable: false });
    setTimeout(() => {
      this.setState({ stickerAvailable: true });
    }, lockOutTime * 1000);
  }

  startStickerEvent() {
    this.props.startStickerEvent();
    this.lockOutSticker(15);
  }

  toggleTeacherMenu() {
    this.setState({ showTeacherMenuToggle: !this.state.showTeacherMenuToggle });
  }

  toggleConcentrationMenu() {
    this.props.toggleConcentrationMenu();
  }

  toggleStretching() {
    this.props.toggleStretching();
  }

  toggleVideoLayout() {
    this.props.toggleVideoLayout();
  }

  VideoLayout = () => {
    if (this.props.videoLayout === "bigTeacher") {
      return (
        <div className="buttonStyle">
          <ViewAgenda />
          <p>발표자 위주</p>
        </div>
      );
    } else if (this.props.videoLayout === "bigTeacher") {
      return (
        <div className="buttonStyle">
          <ViewArray />
          <p>동등분할</p>
        </div>
      );
    } else if (this.props.videoLayout === "screenShareOn") {
      return (
        <div className="buttonStyle">
          <ScreenIcon />
          <p>화면공유</p>
        </div>
      );
    } else {
      return null;
    }
  };

  // render: 렌더링 함수
  render() {
    const mySessionId = this.props.sessionId;
    const localUser = this.props.user;
    return (
      <AppBar
        className="toolbar"
        id={this.props.whoami === "teacher" ? "teacher-header" : "header"}
      >
        <Toolbar className="toolbar">
          {mySessionId && (
            // <div id="titleContent">
            <span id="session-title">{mySessionId}</span>
            // </div>
          )}

          <div className="buttonsContent">
            <IconButton
              color="inherit"
              className="navButton"
              id="navMicButton"
              onClick={this.micStatusChanged}
            >
              {localUser !== undefined && localUser.isAudioActive() ? (
                <div className="buttonStyle">
                  <SoundIcon />
                  <p>음소거</p>
                </div>
              ) : (
                <div className="buttonStyle">
                  <MuteIcon color="secondary" />
                  <p>음소거 해제</p>
                </div>
              )}
            </IconButton>

            <IconButton
              color="inherit"
              className="navButton"
              id="navCamButton"
              onClick={this.camStatusChanged}
            >
              {localUser !== undefined && localUser.isVideoActive() ? (
                <div className="buttonStyle">
                  <VideoIcon />
                  <p>비디오 중지</p>
                </div>
              ) : (
                <div className="buttonStyle">
                  <NoVideoIcon color="secondary" />
                  <p>비디오 시작</p>
                </div>
              )}
            </IconButton>

            {/* {this.props.whoami === "teacher" && ( */}
            {
              <IconButton
                color="inherit"
                className="navButton"
                id="navRandButton"
                onClick={this.toggleTeacherMenu}
              >
                <div className="buttonStyle">
                  <GameIcon />
                  <p>게임</p>
                </div>
              </IconButton>
            }

            {this.props.whoami === "teacher" && (
              <div className="teacher-toolbar">
                <TeachersToolbar
                  display={this.state.showTeacherMenuToggle}
                  randAvailable={this.state.randAvailable}
                  stickerAvailable={this.state.stickerAvailable}
                  pickRandomStudent={this.pickRandomStudent}
                  startStickerEvent={this.startStickerEvent}
                  toggleStretching={this.toggleStretching}
                  toggleQuiz={this.toggleQuiz}
                  toggleTeacherMenu={this.toggleTeacherMenu}
                  toggleConcentrationMenu={this.toggleConcentrationMenu}
                />
              </div>
            )}

            <IconButton
              color="inherit"
              className="navButton"
              onClick={this.screenShare}
            >
              {localUser !== undefined && localUser.isScreenShareActive() ? (
                <div className="buttonStyle">
                  <PictureInPicture />
                  <p>화면공유 전환</p>
                </div>
              ) : (
                <div className="buttonStyle">
                  <ScreenIcon />
                  <p>화면공유</p>
                </div>
              )}
            </IconButton>

            {localUser !== undefined && localUser.isScreenShareActive() && (
              <IconButton onClick={this.stopScreenShare} id="navScreenButton">
                <div className="buttonStyle">
                  <StopScreenShare color="secondary" />
                  <p>화면공유 중지</p>
                </div>
              </IconButton>
            )}

            <IconButton
              color="inherit"
              className="navButton"
              onClick={this.toggleSetting}
            >
              <div className="buttonStyle">
                <SettingIcon />
                <p>설정</p>
              </div>
            </IconButton>

            <IconButton
              color="inherit"
              className="navButton"
              onClick={this.toggleFullscreen}
            >
              {localUser !== undefined && this.state.fullscreen ? (
                <div className="buttonStyle">
                  <FullscreenExit />
                  <p>전체화면 취소</p>
                </div>
              ) : (
                <div className="buttonStyle">
                  <Fullscreen />
                  <p>전체화면</p>
                </div>
              )}
            </IconButton>

            <IconButton
              color="inherit"
              className="navButton"
              onClick={this.toggleVideoLayout}
            >
              {localUser !== undefined
                ? (this.props.videoLayout === "bigTeacher" && (
                    <div className="buttonStyle">
                      <OneIcon />
                      <p>발표자 위주</p>
                    </div>
                  )) ||
                  (this.props.videoLayout === "equalSize" && (
                    <div className="buttonStyle">
                      <SeperateIcon />
                      <p>동등분할</p>
                    </div>
                  )) ||
                  (this.props.videoLayout === "screenShareOn" && (
                    <div className="buttonStyle">
                      <Share />
                      <p>공유자 우선</p>
                    </div>
                  ))
                : null}
            </IconButton>
            {this.props.whoami !== "teacher" ? (
              <IconButton
                color="secondary"
                className="navButton"
                onClick={this.selfLeaveSession}
                id="navLeaveButton"
              >
                <div className="buttonStyle">
                  <ExitIcon />
                  <p>수업 나가기</p>
                </div>
              </IconButton>
            ) : (
              <IconButton
                color="secondary"
                className="navButton"
                onClick={this.leaveSession}
                id="navLeaveButton"
              >
                <div className="buttonStyle">
                  <ExitIcon />
                  <p>수업 나가기</p>
                </div>
              </IconButton>
            )}

            <IconButton
              color="inherit"
              onClick={this.toggleEmoji}
              className="navButton"
              id="navEmoji"
            >
              <div className="buttonStyle">
                <EmojiIcon />
                <p>이모지</p>
              </div>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={this.toggleConcentrationMenu}
              className="navButton"
              id="navCon"
            >
              <div className="buttonStyle">
                <ConcentrationIcon />
                <p>집중도</p>
              </div>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={this.toggleQuestion}
              className="navButton"
              id="navQuestButton"
            >
              <div className="buttonStyle">
                {this.props.showQuestionNotification && (
                  <div id="questPoint" className="" />
                )}
                <QuestionMarkIcon />
                <p>익명질문</p>
              </div>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={this.toggleChat}
              className="navButton"
              id="navChatButton"
            >
              <div className="buttonStyle">
                {this.props.showNotification && <div id="point" className="" />}
                <ChatIcon />
                <p>채팅</p>
              </div>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}
