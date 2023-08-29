import { useEffect, useState } from "react";
import SetupComponent from "./components/SetupComponent";
import VideoRoomComponent from "./components/VideoRoomComponent";
import ResultComponent from "./components/ResultComponent";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import whoru from "../utils/whoru";
import InterceptedAxios from "../utils/iAxios";
import Dash from "../pages/Dash";

const App = () => {
  const [tap, setTap] = useState("setup");
  // 배열 형태로 전달
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  // id값으로 전달
  const [selectedVideo, setSelectedVideo] = useState();
  const [selectedAudio, setSelectedAudio] = useState();
  const [selectedSpeaker, setSelectedSpeaker] = useState();
  // 트랙으로 전달
  const [selectedVideoTrack, setSelectedVideoTrack] = useState();
  const [selectedAudioTrack, setSelectedAudioTrack] = useState();
  // 비디오를 켜고 들어갈 것인지 끄고 들어갈 것인지
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  // 통계를 내기 위한 자료
  const [myData, setMyData] = useState([]);
  const [othersData, setOthersData] = useState([]);
  const [absentData, setAbsentData] = useState([]);
  const [teacherData, setTeacherData] = useState();
  // 학생리스트
  const [studentList, setStudentList] = useState([]);
  const [studentInfo, setStudentInfo] = useState({});
  // 내 레벨 확인
  const [levelPng, setLevelPng] = useState("/levels/rainbow.png");


  // 라우팅용
  const navigate = useNavigate();


  // 입장코드
  const { code } = useParams();
  const { state } = useLocation();
  const [conferenceCreateData, setConferenceCreateData] = useState(null);
  const [conferenceJoinData, setConferenceJoinData] = useState(null);


  // const memberStore = useAppSelector((state) => state.member);
  // const whoami = whoru(memberStore.userId);
  const whoami = whoru(4444);

  // conferenceJoinData와 conferenceCreateData를 결정하는 로직
  useEffect(() => {
    if (state.conferenceJoinData) {
      setConferenceJoinData(state.conferenceJoinData);
    } else if (state.conferenceCreateData) {
      setConferenceCreateData(state.conferenceCreateData);
    }
  }, [state.conferenceJoinData, state.conferenceCreateData]);

  // 더블퐁퐁권 사용 가능 여부 판단
  useEffect(() => {
    const getUserItems = async () => {
      // const result = await InterceptedAxios.get(`/items/${memberStore.userId}`);
      // if (result.data.filter((elem) => elem.itemId === 4)[0].cnt > 0)
    };
    if (whoami !== "teacher") getUserItems();
  });

  //   // 만약 state 없이 한번에 url에 접근하려고 했다면
  if (!state) window.location.href = "/";

  const setDevices = {
    videos,
    setVideos,
    audios,
    setAudios,
    speakers,
    setSpeakers,
    selectedVideo,
    setSelectedVideo,
    selectedAudio,
    setSelectedAudio,
    selectedSpeaker,
    setSelectedSpeaker,
    selectedVideoTrack,
    setSelectedVideoTrack,
    selectedAudioTrack,
    setSelectedAudioTrack,
    isVideoOn,
    setIsVideoOn,
    isAudioOn,
    setIsAudioOn,
  };

  return (
    <>
      {tap === "setup" && (
        <SetupComponent
          conferenceCreateData={conferenceCreateData}
          conferenceJoinData={conferenceJoinData}
          setTap={setTap}
          setDevices={setDevices}
          code={code}
          whoami={whoami}
          userId={4444}
        />
      )}
      {tap === "class" && (
        <VideoRoomComponent
          setDevices={setDevices}
          code={code}
          whoami={whoami}
          setTap={setTap}
          setMyData={setMyData}
          setOthersData={setOthersData}
          navigate={navigate}
          conferenceCreateData={conferenceCreateData}
          conferenceJoinData={conferenceJoinData}
          userId={4444}
          studentList={studentList}
          setAbsentData={setAbsentData}
          setTeacherData={setTeacherData}
        />
      )}
      {tap === "result" && (
          <App>
          </App>
      )}
    </>
  );
};

export default App;
