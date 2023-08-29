import { Link, useLocation } from "react-router-dom";
import { Ratio, Button } from "react-bootstrap";
// import RoundCard from "../components/atoms/RoundCard";

import Screen from "../components/stream/Screen";
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { hideBackground, meetingModeTest } from "../store/test";
function Waiting() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const dataObject = location.state?.data;
  const [audioSetting, setAudio] = useState(true);
  const [videoSetting, setVideo] = useState(true);
  dispatch(hideBackground(false));
  //() => setVideo((preValue) => !preValue)
  //{videoSetting ? "끄기" : "켜기"}
  const handleJoining = () => {
    // dispatch(meetingModeTest());
  };

  //설정 창-> modal select
  return (
    <>
      {/* <a>{JSON.stringify(dataObject, null, 2)}</a> */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <Ratio aspectRatio={"16x9"} style={{ minWidth: "600px" }}>
          <Screen audio={audioSetting} video={videoSetting}></Screen>
        </Ratio>
      </div>
      <div
        className="buttons"
        style={{
          padding: "2rem",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div className="" style={{ justifyContent: "flex-start" }}>
          <Button
            size="lg"
            onClick={() => setAudio((preValue) => !preValue)}
            style={{ borderRadius: "30px", marginRight: "10px" }}
          >
            마이크 설정
          </Button>
          <Button
            size="lg"
            onClick={() => setVideo((preValue) => !preValue)}
            style={{ borderRadius: "30px" }}
          >
            비디오 설정
          </Button>
        </div>
        <Link to={"/dash/conference"}>
          <Button
            size="lg"
            style={{ borderRadius: "30px" }}
            onClick={handleJoining}
          >
            회의 참여
          </Button>
        </Link>
      </div>
      {/* </RoundCard> */}
    </>
  );
}

export default Waiting;
