// VideoRoomComponent.js
import React, { Component } from "react";
import axios from "axios";
import InterceptedAxios from "../../utils/iAxios";
import "./VideoRoomComponent.css";
import { OpenVidu } from "openvidu-browser";
import StreamComponent from "./stream/StreamComponent";
import DialogExtensionComponent from "./dialog-extension/DialogExtension";
import ChatComponent from "./chat/ChatComponent";
import QuestionComponent from "./question/QuestionComponent";
import FaceDetection from "../FaceDetection";
import getCode from "../../utils/getCode";
import EmojiFilter from "./items/EmojiFilter";
import QuizModal from "./quiz/QuizModal";
import QuizModalStudent from "./quiz/QuizModalStudent";
import StretchModal from "./stretch/StretchModal.jsx";
import Sticker from "./pointClickEvent/PointSticker";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

import OpenViduLayout from "../layout/openvidu-layout";
import UserModel from "../models/user-model";
import ToolbarComponent from "./toolbar/ToolbarComponent";
import Setting from "./settings/Setting";
import Emoji from "./emoji/Emoji";
import Concentration from "./concentration/Concentration";

let localUser = new UserModel();
let timeout;

// VideoRoomComponent: 비디오룸 전체를 담당하는 컴포넌트
class VideoRoomComponent extends Component {
  constructor(props) {
    super(props);

    // OPENVIDU_SERVER_URL: 오픈비두 서버쪽 URL (포트번호는 변경될 수 있음)
    // this.OPENVIDU_SERVER_URL = this.props.openviduServerUrl
    //     ? this.props.openviduServerUrl
    //     : 'https://' + window.location.hostname + ':4443';

    this.OPENVIDU_SERVER_URL = import.meta.env.VITE_OPENVIDU_SERVER_URL;
    // ? this.props.openviduServerUrl
    // : process.env.REACT_APP_OPENVIDU_SERVER_URL;
    // 서버 비밀번호 (이것도 env에서 끌어 써도 될 듯)
    this.OPENVIDU_SERVER_SECRET = import.meta.env.VITE_OPENVIDU_SERVER_SECRET;

    // hasBeenUpdated: 업데이트 여부 판단하는 변수
    this.hasBeenUpdated = false;
    // layout: 현재 레이아웃 (openvidu-layout.js와 연결)
    this.layout = new OpenViduLayout();
    // sessionName: 세션 이름을 담은 변수 (기본값 SessionA)
    // let sessionName = this.props.code;
    const { conferenceJoinData, conferenceCreateData } = this.props;
    let sessionName;
    // userName: 유저의 이름 (기본 OpenVidu_User + 0부터 99까지의 랜덤한 숫자)
    // let userName = this.props.nickname;
    let userName;
    if (conferenceCreateData) {
      sessionName = this.props.code;
      userName = conferenceCreateData.nickname;
    } else if (conferenceJoinData !== "none" && conferenceJoinData) {
      sessionName = conferenceJoinData.conferenceUrl;
      userName = conferenceJoinData.nickname;
    }
    // remotes:
    this.remotes = [];
    // localUserAccessAllowed:
    this.localUserAccessAllowed = false;
    // 스마일 유저값
    let smile = this.props.smile;
    // 유저 out of angle
    let outAngle = this.props.outAngle;

    let concentration = this.props.concentration;

    let concentrationList = this.props.concentrationList;

    // 상태값들 (mySessionId: 접속중인 세션이름, myUserName: 내 이름, session: 세션에 대한 정보, localUser: 내 정보, subscribers: 같이 접속한 사람들, chatDisplay: 채팅창 on 여부, currentVideoDevice: 현재 비디오 출력장치)
    this.state = {
      mySessionId: sessionName,
      myUserName: userName,
      session: undefined,
      localUser: undefined,
      subscribers: [],
      teacher: { nickname: "" },
      students: [],
      absentStudents: this.props.studentList,
      chatDisplay: "none",
      questionDisplay: "none",
      quizDisplay: false,
      quizDisplayStudent: false,
      randomStretch: Math.floor(Math.random() * 11) + 1,
      stretchingDisplay: false,
      videos: this.props.setDevices.videos,
      audios: this.props.setDevices.audios,
      speakers: this.props.setDevices.speakers,
      currentVideoDevice: this.props.setDevices.selectedVideoTrack,
      currentAudioDevice: this.props.setDevices.selectedAudioTrack,
      currentVideoDeviceId: this.props.setDevices.selectedVideo,
      currentAudioDeviceId: this.props.setDevices.selectedAudio,
      currentSpeakerDeviceId: this.props.setDevices.selectedSpeaker,
      randPick: undefined,
      smile: smile,
      outAngle: outAngle,
      loading: true,
      totalHeight: 0,
      totalWidth: 0,
      stickers: [],
      quiz: {},
      quizHistory: [],
      settingDisplay: false,
      videoLayout: "bigTeacher",
      presentationCnt: 0,
      sortType: "all",
      emojiDisplay: false,
      isEmojiOn: false,
      teacherMenuDisplay: false,
      isCodeModalOpen: false,
      concentration: concentration,
      concentrationList: concentrationList,
      people: 0,
      total: 0,
      concentrationDisplay: false,
    };

    // 메서드 바인딩 과정
    // joinSession: 세션 접속
    this.joinSession = this.joinSession.bind(this);
    // leaveSession: 세션 접속해제
    this.leaveSession = this.leaveSession.bind(this);
    // selfLeaveSession: 학생 혼자 세션 나갔을 때
    this.selfLeaveSession = this.selfLeaveSession.bind(this);
    // onbeforeunload: 접속 종료 전에 일어나는 일들을 처리하는 함수
    this.onbeforeunload = this.onbeforeunload.bind(this);
    // updateLayout: 레이아웃 업데이트
    this.updateLayout = this.updateLayout.bind(this);
    // camStatusChanged: 캠 상태 변경 함수
    this.camStatusChanged = this.camStatusChanged.bind(this);
    // micStatusChanged: 마이크 상태 변경 함수
    this.micStatusChanged = this.micStatusChanged.bind(this);
    // pickRandomStudent: 랜덤 학생 찍어주는 함수
    this.pickRandomStudent = this.pickRandomStudent.bind(this);
    // toggleFullscreen: 전체화면 처리 함수
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    // screenShare: 화면 공유 함수
    this.screenShare = this.screenShare.bind(this);
    // stopScreenShare: 화면 공유 중지 함수
    this.stopScreenShare = this.stopScreenShare.bind(this);
    // closeDialogExtension?: 익스텐션 설치 알림창 닫을 때 작동하는 함수
    this.closeDialogExtension = this.closeDialogExtension.bind(this);
    // toggleChat: 채팅 토글 버튼 함수
    this.toggleChat = this.toggleChat.bind(this);
    // toggleQuestion: 질문 토글 버튼 함수
    this.toggleQuestion = this.toggleQuestion.bind(this);
    // toggleSetting: 설정 토글 버튼 함수
    this.toggleSetting = this.toggleSetting.bind(this);
    // checkNotification: 알림 확인 함수
    this.checkNotification = this.checkNotification.bind(this);
    this.checkQuestionNotification = this.checkQuestionNotification.bind(this);
    // checkSize: 화면 크기 체크 함수
    this.checkSize = this.checkSize.bind(this);
    // smile: 웃는 이모지 체크 함수
    this.smile = this.smile.bind(this);
    // outAngle: 화상인식 가능 여부 체크 함수
    this.outAngle = this.outAngle.bind(this);
    // frameChanged: 테두리 색깔 변경 함수
    this.frameChanged = this.frameChanged.bind(this);
    // toggleQuiz: 퀴즈창 토글 버튼 함수
    this.toggleQuiz = this.toggleQuiz.bind(this);
    // toggleQuizStudent: 내정답 저장
    this.toggleQuizStudent = this.toggleQuizStudent.bind(this);
    // checkUserHasItem: 유저의 아이템 정보 체크 함수
    this.checkUserHasItem = this.checkUserHasItem.bind(this);
    // startStickerEvent: 칭찬스티커 클릭이벤트를 발생시키는 함수
    this.startStickerEvent = this.startStickerEvent.bind(this);
    this.toggleStretching = this.toggleStretching.bind(this);
    // answerUpdate: 퀴즈 정답 수신해서 통계에 적용하는 함수
    this.answerUpdate = this.answerUpdate.bind(this);
    // 설정용 함수
    this.setMyVideos = this.setMyVideos.bind(this);
    this.setMyAudios = this.setMyAudios.bind(this);
    this.setMySpeakers = this.setMySpeakers.bind(this);
    this.setVideo = this.setVideo.bind(this);
    this.setAudio = this.setAudio.bind(this);
    this.setSpeaker = this.setSpeaker.bind(this);
    this.whoTeacherOrStudent = this.whoTeacherOrStudent.bind(this);
    // 이모지
    this.toggleEmoji = this.toggleEmoji.bind(this);
    // this.people = this.people.bind(this);
    // 발표 횟수 체크
    this.upPresentationCnt = this.upPresentationCnt.bind(this);
    this.downPresentationCnt = this.downPresentationCnt.bind(this);
    // 정렬 변경 이벤트핸들러
    this.partsSortChange = this.partsSortChange.bind(this);
    // 선생님 메뉴 토글버튼
    this.toggleTeacherMenu = this.toggleTeacherMenu.bind(this);

    // 집중도
    this.concentrationEvent = this.concentrationEvent.bind(this);
    this.toggleConcentrationMenu = this.toggleConcentrationMenu.bind(this);
  }

  // componentDidMount: 컴포넌트가 마운트 되었을 때 작동하는 리액트 컴포넌트 생명주기함수
  componentDidMount() {
    // openViduLayoutOptions: 화면 레이아웃 설정
    const openViduLayoutOptions = {
      maxRatio: 9 / 16, // The narrowest ratio that will be used (default 2x3)
      minRatio: 9 / 16, // The widest ratio that will be used (default 16x9)
      fixedRatio: true, // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
      bigClass: "OV_big", // The class to add to elements that should be sized bigger
      bigPercentage: 0.8, // The maximum percentage of space the big ones should take up
      bigFixedRatio: false, // fixedRatio for the big ones
      bigMaxRatio: 3 / 2, // The narrowest ratio to use for the big elements (default 2x3)
      bigMinRatio: 9 / 16, // The widest ratio to use for the big elements (default 16x9)
      bigFirst: true, // Whether to place the big one in the top left (true) or bottom right
      animate: true, // Whether you want to animate the transitions
    };

    // 초기 화면 설정
    this.layout.initLayoutContainer(
      document.getElementById("layout"),
      openViduLayoutOptions
    );

    // 화면 크기 변경 및 종료시 발생하는 이벤트핸들러 달아두기
    window.addEventListener("beforeunload", this.onbeforeunload);
    window.addEventListener("resize", this.updateLayout);
    window.addEventListener("resize", this.checkSize);

    // 세션에 조인하기
    this.joinSession();
  }

  // componentWillUnmount: 컴포넌트가 언마운트 됐을 때 작동하는 리액트 컴포넌트 생명주기함수
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
    window.removeEventListener("resize", this.updateLayout);
    window.removeEventListener("resize", this.checkSize);
    this.leaveSession();
  }

  // onbeforeunload: 페이지를 떠나기 직전에 작동하는 함수
  onbeforeunload(event) {
    this.leaveSession();
  }

  // joinSession: 세션에 접속할 때 작동하는 함수
  joinSession() {
    this.OV = new OpenVidu();

    // setState: 1st 매개변수 - 상태값 설정, 2nd 매개변수 - 콜백함수
    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        this.subscribeToStreamCreated();
        this.connectToSession();
      }
    );
  }

  // connectToSession: 세션 연결을 위한 토큰을 받아서 연결을 처리하는 함수
  connectToSession() {
    if (this.props.token !== undefined) {
      this.connect(this.props.token);
    } else {
      this.getToken().then((token) => {
        this.connect(token);
      });
      // .catch((error) => {
      //   if (this.props.error) {
      //     this.props.error({
      //       error: error.error,
      //       messgae: error.message,
      //       code: error.code,
      //       status: error.status,
      //     });
      //   }
      //   console.log(
      //     "There was an error getting the token:",
      //     error.code,
      //     error.message
      //   );
      //   alert("There was an error getting the token:", error.message);
      // });
    }
  }

  // connect: 토큰을 매개변수로 받아서 실제 세션에 접속하게 해주는 함수
  connect(token) {
    const time = new Date();
    let attTime =
      String(time.getHours()).padStart(2, "0") +
      ":" +
      String(time.getMinutes()).padStart(2, "0") +
      ":" +
      String(time.getSeconds()).padStart(2, "0");
    localUser.setAttendanceTime(attTime);

    // uid 저장
    localUser.setUid(this.props.userId);

    // 시작할 때 장치 상태를 localUser에 저장
    localUser.setAudioActive(this.props.setDevices.isAudioOn);
    localUser.setVideoActive(this.props.setDevices.isVideoOn);

    // if (this.props.memberStore.borderColor === 1) {
    const frameColor = {
      type: "style",
      value: {
        border: "10px solid transparent",
        borderRadius: "15px",
        backgroundImage:
          "linear-gradient(#ffffff, #e1e1e1), linear-gradient(to right, #ebacff, #9899dd, #abe8f0)",
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
      },
    };
    localUser.setFrameColor(frameColor);

    // 유저끼리 데이터 교환
    this.state.session
      .connect(token, {
        clientData: this.state.myUserName,
        attTime: localUser.attendanceTime,
        randPick: this.state.randPick,
        uid: this.props.userId,
        frameColor: localUser.frameColor,
      })
      .then(() => {
        this.connectWebCam();
      })
      .then(() => {
        this.whoTeacherOrStudent();
      })
      .catch((error) => {
        if (this.props.error) {
          this.props.error({
            error: error.error,
            message: error.message,
            code: error.code,
            status: error.status,
          });
        }
        alert("There was an error connecting to the session:", error.message);
        console.log(
          "There was an error connecting to the session:",
          error.code,
          error.message
        );
      });
  }

  whoTeacherOrStudent() {
    let updateTeacher;
    let updateStudents;
    if (this.props.whoami === "teacher") updateTeacher = localUser;
    else
      updateTeacher = this.remotes.filter(
        (elem) => elem.nickname.substr(1, 3) === "선생님"
      );

    if (this.props.whoami === "teacher") updateStudents = this.remotes;
    else
      updateStudents = this.remotes.filter(
        (elem) => elem.nickname.substr(1, 3) !== "선생님"
      );
    this.setState({
      teacher: updateTeacher,
      students: updateStudents,
    });
  }

  // connectWebCam: 웹캠을 연결하는 함수 (실제 WebRTC와 연관된 내부 메서드들과 유사)
  async connectWebCam() {
    // // 현재 연결된 디바이스를 받음
    // var devices = await this.OV.getDevices();
    // // 연결된 디바이스 중에서 비디오 디바이스를 필터링
    // var videoDevices = devices.filter((device) => device.kind === 'videoinput');

    // publisher 초기설정(자기자신)
    let publisher = this.OV.initPublisher(undefined, {
      audioSource: this.state.currentAudioDevice,
      videoSource: this.state.currentVideoDevice,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: "1280x720",
      frameRate: 30,
      insertMode: "APPEND",
    });

    // 접근 허용되었을 때 설정 변경
    if (this.state.session.capabilities.publish) {
      publisher.on("accessAllowed", () => {
        this.state.session.publish(publisher).then(() => {
          this.updateSubscribers();
          this.localUserAccessAllowed = true;
          if (this.props.joinSession) {
            this.props.joinSession();
          }
        });
      });
    }

    // 로컬 유저(자신)의 정보 및 환경설정
    localUser.setNickname(this.state.myUserName);
    localUser.setConnectionId(this.state.session.connection.connectionId);
    localUser.setScreenShareActive(false);
    localUser.setStreamManager(publisher);
    this.concentrationEvent(6)

    // 이벤트 등록
    if (this.props.whoami !== "teacher") this.subscribeToSessionClosed();
    this.subscribeToUserChanged();
    this.subscribeToStreamDestroyed();

    this.sendSignalUserChanged({
      isScreenShareActive: localUser.isScreenShareActive(),
    });

    this.setState(
      {
        localUser: localUser,
      },
      () => {
        this.state.localUser.getStreamManager().on("streamPlaying", (e) => {
          this.updateLayout();
          publisher.videos[0].video.parentElement.classList.remove(
            "custom-class"
          );
        });
      }
    );
  }

  // updateSubscribers: 자신의 정보를 구독하고 있는(받고 있는) 유저들의 정보를 업데이트
  updateSubscribers() {
    const subscribers = this.remotes;
    this.setState(
      {
        subscribers: subscribers,
      },
      () => {
        if (this.state.localUser) {
          this.sendSignalUserChanged({
            isAudioActive: this.state.localUser.isAudioActive(),
            isVideoActive: this.state.localUser.isVideoActive(),
            nickname: this.state.localUser.getNickname(),
            presentationCnt: this.state.localUser.getPresentationCnt(),
            isScreenShareActive: this.state.localUser.isScreenShareActive(),
            frameColor: this.state.localUser.getFrameColor(),
            emojiUsed: this.state.localUser.getEmoji(),
            concentration: this.state.localUser.getConcentration(),
            // concentrationList: this.state.concentrationList.push(
            //   this.state.localUser.getConcentration()
            // ),
            // total:
            //   this.state.concentrationList.reduce((a, b) => a + b, 0) /
            //   this.state.concentrationList.length,
          });
        }
        this.updateLayout();
        this.whoTeacherOrStudent();
      }
    );
    // console.log('하ㅔ앟멯ㅇㅎ', subscribers);
  }

  // 학생이 자기혼자 나간경우
  selfLeaveSession() {
    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    // 모든 설정들 초기화
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "SessionA",
      myUserName: "퇴장한 유저",
      localUser: undefined,
    });
    if (this.props.selfLeaveSession) {
      this.props.selfLeaveSession();
    }

    // 우선 임시로 카메라를 꺼뜨리기 위해서..
    this.props.navigate("/student");
    window.location.href = "/student";
  }

  // leaveSession: 세션을 빠져나가는 함수
  async leaveSession() {
    const mySession = this.state.session;
    mySession.unpublish(localUser.getStreamManager());
    this.state.localUser.getStreamManager().stream.session.signal({
      type: "classClosed",
    });

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    // 모든 설정들 초기화

    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "SessionA",
      myUserName: "퇴장한 유저",
      localUser: undefined,
    });

    if (this.props.leaveSession) {
      this.props.leaveSession();
    }
    this.props.setTap("result");
  }

  // camStatusChanged: 캠 설정 변경
  camStatusChanged() {
    localUser.setVideoActive(!localUser.isVideoActive());
    localUser.getStreamManager().publishVideo(localUser.isVideoActive());
    this.sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
    this.setState({ localUser: localUser });
  }

  // micStatusChanged: 마이크 설정 변경
  micStatusChanged() {
    localUser.setAudioActive(!localUser.isAudioActive());
    localUser.getStreamManager().publishAudio(localUser.isAudioActive());
    this.sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
    this.setState({ localUser: localUser });
  }

  upPresentationCnt() {
    this.state.localUser.upPresentationCnt();
    this.sendSignalUserChanged({
      presentationCnt: localUser.getPresentationCnt(),
    });
    this.setState({ localUser: localUser });
  }

  downPresentationCnt() {
    this.state.localUser.downPresentationCnt();
    this.sendSignalUserChanged({
      presentationCnt: localUser.getPresentationCnt(),
    });
    this.setState({ localUser: localUser });
  }

  // deleteSubscriber: 매개변수로 받은 stream을 가진 유저를 구독자 명단에서 제거하는 함수
  deleteSubscriber(stream) {
    const remoteUsers = this.state.subscribers;
    const userStream = remoteUsers.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];
    this.props.setTeacherData(userStream);
    let index = remoteUsers.indexOf(userStream, 0);
    if (index > -1) {
      remoteUsers.splice(index, 1);
      this.setState({
        subscribers: remoteUsers,
      });
    }
    this.whoTeacherOrStudent();
  }

  // subscribeToStreamCreated: 새롭게 접속한 사람의 스트림을 구독하는 함수
  subscribeToStreamCreated() {
    this.state.session.on("streamCreated", (event) => {
      // 새롭게 등장한 구독할 객체를 subscriber에 저장
      const subscriber = this.state.session.subscribe(event.stream, undefined);
      // var subscribers = this.state.subscribers;

      subscriber.on("streamPlaying", (e) => {
        this.checkSomeoneShareScreen();
        subscriber.videos[0].video.parentElement.classList.remove(
          "custom-class"
        );
      });
      // 새로운 유저 껍데기를 만들어서 거기에 이벤트로 받은 stream정보를 넣은 후에 내 remotes에 등록
      const newUser = new UserModel();
      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(event.stream.connection.connectionId);
      newUser.setType("remote");
      newUser.setAudioActive(event.stream.audioActive);
      newUser.setVideoActive(event.stream.videoActive);

      newUser.setAttendanceTime(
        JSON.parse(event.stream.connection.data).attTime
      );

      newUser.setUid(JSON.parse(event.stream.connection.data).uid);
      const nickname = event.stream.connection.data.split("%")[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      this.remotes.push(newUser);
      if (JSON.parse(nickname).clientData.substr(1, 3) === "선생님")
        this.props.setTeacherData(newUser);
      if (this.localUserAccessAllowed) {
        this.updateSubscribers();
      }
    });
  }

  // subscribeToStreamDestroyed: streamDestoryed 이벤트가 들어왔을 때 해당하는 stream요소를 구독 목록에서 제거하는 함수
  subscribeToStreamDestroyed() {
    // On every Stream destroyed...
    this.state.session.on("streamDestroyed", (event) => {
      // Remove the stream from 'subscribers' array
      this.deleteSubscriber(event.stream);
      setTimeout(() => {
        this.checkSomeoneShareScreen();
      }, 20);
      this.updateLayout();
    });
  }

  // subscribeToUserChanged: 구독한 유저중에 닉네임, 비디오, 오디오, 화면공유, 포인트 상태가 변경되었을 때 감지해서 화면을 바꿔주는 함수
  subscribeToUserChanged() {
    this.state.session.on("signal:userChanged", (event) => {
      let remoteUsers = this.state.subscribers;
      let size = remoteUsers.length;
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname);
          }
          if (data.presentationCnt != undefined) {
            user.setPresentationCnt(data.presentationCnt);
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive);
            if (data.isScreenShareActive) {
              this.setState({ videoLayout: "screenShareOn" });
            } else if (!data.isScreenShareActive) {
              this.setState({ videoLayout: "bigTeacher" });
            }
            this.updateLayout();
          }
          if (data.picked !== undefined) {
            user.setPicked(data.picked);
          }
          if (data.randPick !== undefined) {
            if (
              data.randPick ===
              this.state.localUser.getStreamManager().stream.streamId
            ) {
              // alert(this.state.myUserName + "님이 뽑혔습니다!");
              this.alertToChat(this.state.myUserName + "님이 뽑혔습니다!");
              if (!data.picked) {
                // this.toggleShield();
              } else {
                // this.tempFrameChange({ type: "color", value: "Red" });
                this.upPresentationCnt();
                this.tempFrameChange({
                  type: "style",
                  value: {
                    animation: "alertFrame 2s linear 1",
                  },
                });
              }
            } else if (
              data.randPick !==
              this.state.localUser.getStreamManager().stream.streamId
            ) {
              // this.toggleShieldLoading();
              if (!data.picked) {
                // this.toggleShieldLoading();
              }
            }
          }
          if (data.isSmileActive !== undefined) {
            console.log(data.isSmileActive ? "웃음" : "안웃음");
            user.setSmileActive(data.isSmileActive);
          }
          if (data.isOutAngleActive !== undefined) {
            user.setOutAngleActive(data.isOutAngleActive);
          }
          if (data.frameColor !== undefined) {
            user.setFrameColor(data.frameColor);
          }
          if (data.clickEvent !== undefined) {
            // console.log('스티커 추가');
            // console.log(event.from.remoteOptions);
            // console.log(data);
            this.addNewStickers(data.clickEvent);
          }
          if (data.quizCreated !== undefined) {
            this.popUpQuiz(data.quizCreated);
          }
          if (data.quizAnswerCreated !== undefined) {
            this.answerUpdate(data.quizAnswerCreated);
          }
          if (data.emojiUsed !== undefined) {
            user.setEmoji(data.emojiUsed);
          }
          if (data.concentration !== undefined) {
            user.setConcentration(data.concentration);
            this.state.people = size;
            user.setTotal(data.concentration);
            // user.setConcentrationList(data.concentration)
            console.log("!!!!!!!!!!!!!")
            console.log(user.getConcentrationList())
            this.setState({
              total: user.getTotal(),
              concentration: user.getConcentration(),
              concentrationList: user.getConcentrationList(),
            });
          }
          if (data.stretchCreated !== undefined) {
            if (timeout) clearTimeout(timeout); // 쓰로틀링을 사용했습니다.
            this.setState({
              stretchingDisplay: !this.state.stretchingDisplay,
              randomStretch: data.stretchCreated,
            });
            timeout = setTimeout(() => {
              this.setState({ stretchingDisplay: false });
            }, 5 * 1000);
          }
        }
      });
      this.setState(
        {
          subscribers: remoteUsers,
        },
        () => this.checkSomeoneShareScreen()
      );
    });
  }

  subscribeToSessionClosed() {
    this.state.session.on("signal:classClosed", (event) => {
      this.leaveSession();
    });
  }

  // updateLayout: 레이아웃을 업데이트 하는 함수
  updateLayout() {
    this.setState({
      totalHeight: this.layout.getHeight(document.getElementById("layout")),
      totalWidth: this.layout.getWidth(document.getElementById("layout")),
    });
    setTimeout(() => {
      this.layout.updateLayout();
    }, 20);
  }

  // sendSignalUserChanged: 유저 정보가 변경되었음을 알려주는 함수
  sendSignalUserChanged(data) {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    this.state.session.signal(signalOptions);
  }

  // toggleFullscreen: 전체화면을 토글하는 함수
  toggleFullscreen() {
    const document = window.document;
    const fs = document.getElementById("root");
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (fs.requestFullscreen) {
        fs.requestFullscreen();
      } else if (fs.msRequestFullscreen) {
        fs.msRequestFullscreen();
      } else if (fs.mozRequestFullScreen) {
        fs.mozRequestFullScreen();
      } else if (fs.webkitRequestFullscreen) {
        fs.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  // 디바이스들 갱신하기
  setMyVideos(videos) {
    this.setState({ videos: videos });
  }

  // 디바이스들 갱신하기
  setMyAudios(audios) {
    this.setState({ audios: audios });
  }

  // 디바이스들 갱신하기
  setMySpeakers(speakers) {
    this.setState({ speakers: speakers });
  }

  async setVideo(deviceId, devices) {
    try {
      const newVideoDevice = devices.filter(
        (device) => deviceId === device.deviceId
      );

      // 새로운 디바이스가 존재한다면
      if (newVideoDevice.length > 0) {
        // Creating a new publisher with specific videoSource
        // In mobile devices the default and first camera is the front one
        // Publisher를 새롭게 설정
        const newPublisher = this.OV.initPublisher(undefined, {
          audioSource: this.state.currentAudioDeviceId,
          videoSource: newVideoDevice[0].deviceId,
          publishAudio: localUser.isAudioActive(),
          publishVideo: localUser.isVideoActive(),
          mirror: true,
        });

        //newPublisher.once("accessAllowed", () => {
        // 현재 스트림매니저가 관리하는 값들을 publish 해제하고 위에서 만든 새로운 Publisher를 발행 후 localUser에 등록
        await this.state.session.unpublish(
          this.state.localUser.getStreamManager()
        );
        await this.state.session.publish(newPublisher);
        this.state.localUser.setStreamManager(newPublisher);
        // 현재 컴포넌트의 상태값 변경
        this.setState({
          currentVideoDevice: newVideoDevice[0],
          currentVideoDeviceId: newVideoDevice[0].deviceId,
          localUser: localUser,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async setAudio(deviceId, devices) {
    try {
      const newAudioDevice = devices.filter(
        (device) => deviceId === device.deviceId
      );

      // 새로운 디바이스가 존재한다면
      if (newAudioDevice.length > 0) {
        // Creating a new publisher with specific videoSource
        // In mobile devices the default and first camera is the front one
        // Publisher를 새롭게 설정
        const newPublisher = this.OV.initPublisher(undefined, {
          audioSource: newAudioDevice[0].deviceId,
          videoSource: this.state.currentVideoDeviceId,
          publishVideo: localUser.isVideoActive(),
          publishAudio: localUser.isAudioActive(),
          mirror: true,
        });

        //newPublisher.once("accessAllowed", () => {
        // 현재 스트림매니저가 관리하는 값들을 publish 해제하고 위에서 만든 새로운 Publisher를 발행 후 localUser에 등록
        await this.state.session.unpublish(
          this.state.localUser.getStreamManager()
        );
        await this.state.session.publish(newPublisher);
        this.state.localUser.setStreamManager(newPublisher);
        // 현재 컴포넌트의 상태값 변경
        this.setState({
          currentAudioDevice: newAudioDevice[0],
          currentAudioDeviceId: newAudioDevice[0].deviceId,
          localUser: localUser,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  setSpeaker(deviceId) {
    this.setState({
      currentSpeakerDeviceId: deviceId,
    });
  }

  // screenShare: 화면 공유를 도와주는 함수
  screenShare() {
    // 파폭만.. 이상해..
    const videoSource =
      navigator.userAgent.indexOf("Firefox") !== -1 ? "window" : "screen";

    // 화면 공유 하는 사람의 상태 확인
    const publisher = this.OV.initPublisher(
      undefined,
      {
        videoSource: videoSource,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        mirror: false,
      },
      (error) => {
        if (error && error.name === "SCREEN_EXTENSION_NOT_INSTALLED") {
          this.setState({ showExtensionDialog: true });
        } else if (error && error.name === "SCREEN_SHARING_NOT_SUPPORTED") {
          alert("브라우저가 화면 공유를 지원하지 않습니다!");
        } else if (error && error.name === "SCREEN_EXTENSION_DISABLED") {
          alert("화면 공유를 위한 확장프로그램을 사용할 수 없습니다.");
        } else if (error && error.name === "SCREEN_CAPTURE_DENIED") {
          alert("화면 공유를 취소합니다.");
        }
      }
    );

    // 접근 허용이 되어있다면 스크린쉐어를 위한 상태값 변경
    publisher.once("accessAllowed", () => {
      this.state.session.unpublish(localUser.getStreamManager());
      localUser.setStreamManager(publisher);
      this.state.session.publish(localUser.getStreamManager()).then(() => {
        localUser.setScreenShareActive(true);
        this.setState({ localUser: localUser }, () => {
          this.sendSignalUserChanged({
            isScreenShareActive: localUser.isScreenShareActive(),
          });
        });
      });
    });

    // 다른 사람의 streamPlaying이 발생했을 때 내 화면을 다시 초기화
    publisher.on("streamPlaying", () => {
      this.updateLayout();
      publisher.videos[0].video.parentElement.classList.remove("custom-class");
    });
  }

  // closeDialogExtension: 다이얼로그창 닫기 함수
  closeDialogExtension() {
    this.setState({ showExtensionDialog: false });
  }

  // stopScreenShare: 스크린쉐어 중지 함수
  stopScreenShare() {
    // 현재 내용 발행 중지
    this.state.session.unpublish(localUser.getStreamManager());
    // 웹캠 재연결
    this.connectWebCam();
  }

  // checkSomeoneShareScreen: 다른사람이 스크린쉐어를 하고있는지 확인
  checkSomeoneShareScreen() {
    let isScreenShared;
    // return true if at least one passes the test
    isScreenShared =
      this.state.subscribers.some((user) => user.isScreenShareActive()) ||
      localUser.isScreenShareActive();
    if (isScreenShared) {
      this.setState({ videoLayout: "screenShareOn" });
    }
    // else {
    //   this.setState({ videoLayout: 'bigTeacher' });
    // }
    const openviduLayoutOptions = {
      maxRatio: 9 / 16,
      minRatio: 9 / 16,
      fixedRatio: isScreenShared,
      bigClass: "OV_big",
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    };
    this.layout.setLayoutOptions(openviduLayoutOptions);
    this.updateLayout();
  }

  // toggleChat: 채팅 토글 버튼, none면 채팅창 꺼짐, block이면 채팅창 켜짐
  toggleChat() {
    if (this.state.chatDisplay === "none") {
      // notify도 여기서 관리
      this.setState({
        chatDisplay: "block",
        questionDisplay: "none",
        messageReceived: false,
      });
    } else if (this.state.chatDisplay === "block") {
      this.setState({ chatDisplay: "none" });
    }
    this.updateLayout();
  }

  toggleQuestion(property) {
    let display = property;

    if (display === undefined) {
      display = this.state.questionDisplay === "none" ? "block" : "none";
    }

    if (display === "block") {
      // notify도 여기서 관리
      this.setState({
        chatDisplay: "none",
        questionDisplay: display,
        questionReceived: false,
      });
    } else {
      this.setState({ questionDisplay: display });
    }

    this.updateLayout();
  }

  // checkNotification: 채팅 안내 확인
  checkNotification(event) {
    this.setState({
      messageReceived: this.state.chatDisplay === "none",
    });
  }

  // checkQuestionNotification: 질문 안내 확인
  checkQuestionNotification(event) {
    this.setState({
      questionReceived: this.state.questionDisplay === "none",
    });
  }

  // checkSize: 반응형 채팅창을 위한 사이즈체크
  checkSize() {
    if (
      document.getElementById("layout").offsetWidth <= 700 &&
      !this.hasBeenUpdated
    ) {
      this.toggleChat("none");
      this.hasBeenUpdated = true;
    }
    if (
      document.getElementById("layout").offsetWidth > 700 &&
      this.hasBeenUpdated
    ) {
      this.hasBeenUpdated = false;
    }
  }

  pickRandomStudent(list, bool) {
    if (list.length > 0) {
      let studentList = [];
      list.forEach((elem) => {
        studentList.push(elem);
      });
      if (studentList.length > 0) {
        let pickedStudent =
          studentList[Math.floor(Math.random() * studentList.length)];
        this.setState({ randPick: pickedStudent }, () => {
          if (this.state.randPick) {
            this.sendSignalUserChanged({
              randPick: this.state.randPick.streamManager.stream.streamId,
              picked: bool,
            });
            this.setState({ localUser: localUser });
          }
        });
      }
    }
  }

  // smile: 유저 웃는얼굴 체크
  smile(event) {
    if (event !== localUser.isSmileActive()) {
      localUser.setSmileActive(!localUser.isSmileActive());
      localUser.getStreamManager().publishVideo(localUser.isVideoActive());
      this.sendSignalUserChanged({ isSmileActive: localUser.isSmileActive() });
      this.setState({ localUser: localUser });
    }
  }

  // outAngle: 유저 화면내에 화상인식 여부
  outAngle(event) {
    if (event !== localUser.isOutAngleActive()) {
      localUser.setOutAngleActive(!localUser.isOutAngleActive());
      localUser.getStreamManager().publishVideo(localUser.isVideoActive());
      this.sendSignalUserChanged({
        isOutAngleActive: localUser.isOutAngleActive(),
      });
      this.setState({ localUser: localUser });
    }
  }

  concentrationEvent(concentration) {
    localUser.setConcentration(concentration);
    this.sendSignalUserChanged({
      concentration: localUser.getConcentration(),
    });
    this.setState({ localUser: localUser });
  }
  frameChanged(frameColor) {
    let localUser = this.state.localUser;
    localUser.setFrameColor(frameColor);
    this.setState({ localUser: localUser });
    this.sendSignalUserChanged({
      frameColor: this.state.localUser.getFrameColor(),
    });
  }

  alertToChat(message) {
    if (localUser && message) {
      if (message !== "" && message !== " ") {
        const data = {
          message: message,
          nickname: "System",
        };
        localUser.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
  }

  // toggleShield() {
  //   this.setState({ shieldDisplay: !this.state.shieldDisplay });
  //   this.updateLayout();
  // }
  //
  // toggleShieldLoading = () => {
  //   this.setState({ shieldLoadingDisplay: !this.state.shieldLoadingDisplay });
  //   this.updateLayout();
  // };

  async checkUserHasItem(itemId) {
    if (this.props.whoami !== "teacher") {
      if (itemId !== -1) {
        // 1안 axios 요청으로 아이템 정보 획득
        const result = await InterceptedAxios.get(
          `/items/${this.props.userId}`
        );
        const list = result.data;
        // 2안 memberStore에 저장된 정보 가져오기
        // const list = this.props.memberStore.items;
        // console.log(list);
        let cnt = 0;
        list.forEach((elem) => {
          if (elem.itemId === itemId && elem.cnt !== 0) {
            cnt = elem.cnt;
          }
        });
        // 아이템이 없는 경우
        return cnt;
      } else {
        // 잘못된 itemId값 입력
        return 0;
      }
    }
  }

  useItem = (itemId) => {
    InterceptedAxios.delete(`/items/${this.props.userId}/${itemId}`)
      .then(() => {
        return true;
      })
      .catch((e) => {
        console.log(e);
      });
    return false;
  };

  // 클릭 게임!!!
  startStickerEvent = () => {
    this.sendSignalUserChanged({
      clickEvent: 5,
      // clickEvent: 3,
    });
    // this.state.subscribers.forEach((subs) => {
    // });
  };

  // addNewStickers: 호출 시 int값으로 주어진 multiple개 만큼의 칭찬스티커를 전체 화면에 생성하는 함수
  addNewStickers = (multiple) => {
    this.removeAllStickers();
    for (let i = 1; i <= multiple; i++) {
      this.addNewSticker(i);
    }
    this.setState({ stickers: this.state.stickers });
    // console.log(this.state.stickers);
    // this.setState({ stickers: this.state.stickers });
    setTimeout(() => {
      this.removeAllStickers();
    }, 100 * 1000);
    // 수정해야돼 (현재 100초동안)
  };

  addNewSticker = (current) => {

    let imgSize = 100;
    let margin = 8;
    let xStart = margin + 140;
    let xEnd = this.state.totalWidth * 0.7 - imgSize * 2;
    let yStart = margin;
    let yEnd = this.state.totalHeight - 80 - imgSize * 2;
    const newSticker = {
      key: current,
      top: this.between(yStart, yEnd),
      left: this.between(xStart, xEnd),
    };

    this.state.stickers.push(newSticker);
  };

  // removeAllStickers: 호출 시 현재 화면에 생성된 모든 칭찬스티커를 제거하는 함수
  removeAllStickers = () => {
    this.setState({ stickers: [] });
  };

  // removeSticker: 호출 시 int값으로 주어진 current을 키값으로 가지는 칭찬스티커를 제거하는 함수
  removeSticker = (current) => {
    this.setState({
      stickers: this.state.stickers.filter(
        (sticker) => sticker.key !== current
      ),
    });
    this.updateLayout();
  };

  // between: min과 max 사이의 랜덤한 int값을 반환하는 함수
  between = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  tempFrameChange = (tempColor) => {
    let myFrameColor = this.state.localUser.frameColor;
    if (tempColor.type === "color") {
      let styleColor = tempColor.value;
      tempColor = {
        type: "style",
        value: {
          border: "8px solid " + styleColor,
        },
      };
    }
    this.frameChanged(tempColor);
    localUser.setFrameColor(tempColor);
    setTimeout(() => {
      this.frameChanged(myFrameColor);
      this.sendSignalUserChanged({
        picked: false,
      });
    }, 1.5 * 1000);
  };

  toggleSetting() {
    this.setState({ settingDisplay: !this.state.settingDisplay });
  }

  toggleQuiz = (quiz) => {
    if (quiz) {
      this.sendSignalUserChanged({ quizCreated: quiz });
      if (!quiz.result) {
        this.setState({
          quiz: quiz,
          quizHistory: [...this.state.quizHistory, quiz],
        });
      }
    } else {
      this.setState({ quizDisplay: !this.state.quizDisplay });
    }
  };

  toggleStretching = (emitType) => {
    if (timeout) clearTimeout(timeout); // 쓰로틀링을 사용했습니다.
    if (emitType !== "close") {
      this.sendSignalUserChanged({ stretchCreated: this.state.randomStretch });
    }
    this.setState({
      stretchingDisplay: !this.state.stretchingDisplay,
    });
    timeout = setTimeout(() => {
      this.setState({ stretchingDisplay: false });
      this.setState({ randomStretch: Math.floor(Math.random() * 11) + 1 });
    }, 5 * 1000);
  };

  toggleQuizStudent = (answer) => {
    if (answer) {
      this.sendSignalUserChanged({ quizAnswerCreated: answer });
    }
    this.setState({ quizDisplayStudent: !this.state.quizDisplayStudent });
  };

  popUpQuiz = (newQuiz) => {
    if (newQuiz) {
      this.setState({
        quiz: newQuiz,
        quizDisplayStudent: true,
      });
    }
  };

  answerUpdate = (answer) => {
    let quiz = this.state.quiz;
    if (answer === "a1") {
      quiz = { ...this.state.quiz, answerA1: this.state.quiz.answerA1 + 1 };
      this.setState({
        ...this.state,
        quiz: quiz,
      });
    } else if (answer === "a2") {
      quiz = { ...this.state.quiz, answerA2: this.state.quiz.answerA2 + 1 };
      this.setState({
        ...this.state,
        quiz: quiz,
      });
    } else if (answer === "a3") {
      quiz = { ...this.state.quiz, answerA3: this.state.quiz.answerA3 + 1 };
      this.setState({
        ...this.state,
        quiz: quiz,
      });
    } else if (answer === "a4") {
      quiz = { ...this.state.quiz, answerA4: this.state.quiz.answerA4 + 1 };
      this.setState({
        ...this.state,
        quiz: quiz,
      });
    }

    let resultSavedHistory = [];
    this.state.quizHistory.forEach((his) => {
      if (his.question === quiz.question) {
        resultSavedHistory.push(quiz);
      } else {
        resultSavedHistory.push(his);
      }
    });
    this.setState({
      quizHistory: resultSavedHistory,
    });
  };

  toggleVideoLayout = () => {
    if (this.state.videoLayout === "bigTeacher") {
      this.setState({ videoLayout: "equalSize" });
    } else if (this.state.videoLayout === "equalSize") {
      this.setState({ videoLayout: "bigTeacher" });
    }
    this.updateLayout();
  };

  toggleEmoji() {
    this.setState({ emojiDisplay: !this.state.emojiDisplay });
  }

  concentrationCheck() {
    this.setState({ concentration: this.state.concentration });
  }

  concentrationListCheck() {
    this.setState({ concentrationList: this.state.concentrationList });
  }

  totalCheck() {
    this.setState({ total: this.state.total });
  }

  partsSortChange(value) {
    this.setState({
      sortType: value,
    });
  }
  sendEmoji = (emoji) => {
    if (timeout) clearTimeout(timeout); // 쓰로틀링을 사용했습니다.
    localUser.setEmoji(emoji);

    // localUser.getStreamManager().publishVideo(localUser.isVideoActive());
    this.sendSignalUserChanged({ emojiUsed: emoji });
    timeout = setTimeout(() => {
      localUser.setEmoji("");
      this.setState({ emoji: "" });
      this.sendSignalUserChanged({ emojiUsed: "" });
    }, 3 * 1000);
  };

  sendConcentration = (concentration) => {
    localUser.setConcentration(concentration);
    this.setState({ concentration: concentration });
    this.sendSignalUserChanged({ concentration: concentration });
  };

  toggleConcentrationMenu = () => {
    this.setState({ concentrationDisplay: !this.state.concentrationDisplay });
  };
  toggleTeacherMenu() {
    this.setState({ teacherMenuDisplay: !this.state.teacherMenuDisplay });
  }

  openCodeModal = () => {
    this.setState({ isCodeModalOpen: true });
  };

  closeCodeModal = () => {
    this.setState({ isCodeModalOpen: false });
  };

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behaviour MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a session in OpenVidu Server	(POST /api/sessions)
   *   2) Generate a token in OpenVidu Server		(POST /api/tokens)
   *   3) The token must be consumed in Session.connect() method
   */

  // getToken: 현재 내 세션아이디를 이용해서 세션을 생성하고 토큰을 발급하는 함수
  getToken() {
    return this.createSession(this.state.mySessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  // createSession: 세션 생성 함수 (주의! promise를 반환!!) - 서버에 세션아이디를 요청해서 세션을 생성해서 id값을 받아오는 함수
  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(this.OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + this.OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error.response && error.response.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                this.OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  this.OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  this.OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                this.OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  }

  // createToken: 특정 sessionId에 대해서 오픈비두 서버에 토큰을 요청해서 받아오는 함수 (주의! Promise 반환!)
  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({});
      axios
        .post(
          this.OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + this.OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }

  // render: 렌더링을 담당하는 함수
  render() {
    const mySessionId = this.state.mySessionId;
    const localUser = this.state.localUser;
    const subscribers = this.state.subscribers;
    const chatDisplay = { display: this.state.chatDisplay };
    const questionDisplay = { display: this.state.questionDisplay };

    return (
      <>
        <div style={{ overflow: "hidden" }}>
          <Setting
            display={this.state.settingDisplay}
            toggleSetting={this.toggleSetting}
            header="Setting"
            setMyVideos={this.setMyVideos}
            setMyAudios={this.setMyAudios}
            setMySpeakers={this.setMySpeakers}
            videos={this.state.videos}
            audios={this.state.audios}
            speakers={this.state.speakers}
            setVideo={this.setVideo}
            setAudio={this.setAudio}
            setSpeaker={this.setSpeaker}
            currentVideoDeviceId={this.state.currentVideoDeviceId}
            currentAudioDeviceId={this.state.currentAudioDeviceId}
            currentSpeakerDeviceId={this.state.currentSpeakerDeviceId}
          />
          <Emoji
            display={this.state.emojiDisplay}
            toggleEmoji={this.toggleEmoji}
            sendEmoji={this.sendEmoji}
            header="Emoji"
            whoami={this.props.whoami}
            id={this.props.userId}
          />
          <QuizModal
            display={this.state.quizDisplay}
            toggleQuiz={this.toggleQuiz}
            toggleQuizStudent={this.toggleQuizStudent}
            header="퀴즈"
            quiz={this.state.quiz}
            quizHistory={this.state.quizHistory}
          />
          <QuizModalStudent
            display={this.state.quizDisplayStudent}
            toggleQuizStudent={this.toggleQuizStudent}
            header="퀴즈"
            quiz={this.state.quiz}
          />
          <StretchModal
            display={this.state.stretchingDisplay}
            toggleStretching={this.toggleStretching}
            header="스트레칭"
            randomStretch={this.state.randomStretch}
          />
          <Concentration
            people={this.state.people}
            smile={this.state.smile}
            outAngle={this.state.outAngle}
            display={this.state.concentrationDisplay}
            toggleConcentrationMenu={this.toggleConcentrationMenu}
            concentration={this.state.concentration}
            concentrationList={this.state.concentrationList}
            total={this.state.total}
          />

          {/* 다이얼로그 */}
          <DialogExtensionComponent
            showDialog={this.state.showExtensionDialog}
            cancelClicked={this.closeDialogExtension}
          />
          {/* 유저 카메라 화면 */}
          <div
            id="layout"
            className={
              (this.state.chatDisplay === "block" ||
              this.state.questionDisplay === "block"
                ? "sth_on_bounds"
                : "bounds") +
              (this.props.whoami === "teacher" ? " teacher-layout" : "")
            }
          >
            {/* 칭찬스티커 */}
            {this.state.stickers.map((stickerKey) => (
              <Sticker
                key={stickerKey.key}
                stikerKey={stickerKey.key}
                top={200}
                left={120}
                removeSticker={this.removeSticker}
                localUser={localUser}
              ></Sticker>
            ))}
            {localUser !== undefined &&
            localUser.getStreamManager() !== undefined ? (
              <div
                className={
                  (this.state.videoLayout === "bigTeacher" &&
                    localUser.nickname.includes("[선생님]")) ||
                  (this.state.videoLayout === "screenShareOn" &&
                    localUser.isScreenShareActive() === true)
                    ? "OT_root OT_publisher custom-class OV_big"
                    : "OT_root OT_publisher custom-class"
                }
                id="localUser"
              >
                <StreamComponent
                  user={this.state.localUser}
                  currentSpeakerDeviceId={this.state.currentSpeakerDeviceId}
                />
                <FaceDetection
                  autoPlay={localUser.isScreenShareActive() ? false : true}
                  camera={localUser.isVideoActive() ? false : true}
                  smile={this.smile}
                  outAngle={this.outAngle}
                  // sendConcentration={this.concentration}
                  concentrationEvent={this.concentrationEvent}
                />
              </div>
            ) : null}
            {this.state.subscribers.map((sub, i) => (
              <div
                key={i}
                className={
                  (this.state.videoLayout === "bigTeacher" &&
                    sub.nickname.includes("[선생님]")) ||
                  (this.state.videoLayout === "screenShareOn" &&
                    sub.isScreenShareActive() === true)
                    ? "OT_root OT_publisher custom-class OV_big"
                    : "OT_root OT_publisher custom-class"
                }
                id="remoteUsers"
              >
                <StreamComponent
                  user={sub}
                  streamId={sub.streamManager.stream.streamId}
                  currentSpeakerDeviceId={this.state.currentSpeakerDeviceId}
                />
                <EmojiFilter user={sub} whoami={this.props.whoami} />
              </div>
            ))}
          </div>
          <div
            className={
              "sth_component " +
              (this.state.chatDisplay === "none" &&
              this.state.questionDisplay === "none"
                ? "display_none"
                : "")
            }
          >
            {localUser !== undefined &&
              localUser.getStreamManager() !== undefined && (
                <div
                  className="OT_root custom-class quest"
                  style={questionDisplay}
                >
                  <QuestionComponent
                    user={localUser}
                    subscribers={subscribers}
                    questionDisplay={this.state.questionDisplay}
                    close={this.toggleQuestion}
                    messageReceived={this.checkQuestionNotification}
                    whoami={this.props.whoami}
                  />
                </div>
              )}
            {localUser !== undefined &&
              localUser.getStreamManager() !== undefined && (
                <div className="OT_root custom-class chat" style={chatDisplay}>
                  <ChatComponent
                    user={localUser}
                    subscribers={subscribers}
                    chatDisplay={this.state.chatDisplay}
                    close={this.toggleChat}
                    messageReceived={this.checkNotification}
                  />
                </div>
              )}
          </div>
          <div className="toolbar">
            <ToolbarComponent
              teacherName={this.props.teacherName}
              classTitle={this.props.classTitle}
              whoami={this.props.whoami}
              sessionId={mySessionId}
              user={localUser}
              showNotification={this.state.messageReceived}
              showQuestionNotification={this.state.questionReceived}
              camStatusChanged={this.camStatusChanged}
              micStatusChanged={this.micStatusChanged}
              pickRandomStudent={this.pickRandomStudent}
              subscribers={subscribers}
              screenShare={this.screenShare}
              stopScreenShare={this.stopScreenShare}
              toggleFullscreen={this.toggleFullscreen}
              leaveSession={this.leaveSession}
              selfLeaveSession={this.selfLeaveSession}
              toggleChat={this.toggleChat}
              toggleQuestion={this.toggleQuestion}
              toggleQuiz={this.toggleQuiz}
              toggleConcentrationMenu={this.toggleConcentrationMenu}
              toggleStretching={this.toggleStretching}
              toggleSetting={this.toggleSetting}
              startStickerEvent={this.startStickerEvent}
              videoLayout={this.state.videoLayout}
              toggleVideoLayout={this.toggleVideoLayout}
              toggleEmoji={this.toggleEmoji}
              conferenceCreateData={this.props.conferenceCreateData}
              conferenceJoinData={this.props.conferenceJoinData}
            />
          </div>
        </div>
      </>
    );
  }
}

export default VideoRoomComponent;
