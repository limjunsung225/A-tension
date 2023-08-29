import { Nav } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import { NavTab } from "./atoms/tab/NavTab";
import { useAppSelector } from "../store/hooks";
import { getMode } from "../store/test";
import { checkAuthority } from "../store/user";
import { useEffect, useState } from "react";
import Start from "./meeting/Start";
import Join from "./meeting/Join";
import Manage from "./meeting/Manage";
import OpenVidu from "../openvidu/App";
function Meeting() {
  // const [joinedMeeting, setJoin]= useState(false);
  const isLoggedIn = useAppSelector(checkAuthority);
  const inMeeting = useAppSelector(getMode);

  const location = useLocation();
  // const joinData = location.state;

  const [selectedTab, setSelectedTab] = useState("join"); // 기본값은 "chat"으로 설정
  // if(joinData){
  //   setSelectedTab("wait");
  // }
  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };
  useEffect(() => {
    const isJoining = () => {
      const joinData = location?.state?.conferenceJoinData;
      if (joinData) {
        setSelectedTab("wait");
      }else{
        setSelectedTab("join")
      }
    };

    isJoining();
  }, [location]);
  const handleBackToMeeting = () => {
    setSelectedTab("/join");
  };
  return (
    <>
      {/* <h1>회의관리(대시보드)</h1>
      <a>
        회의 관리(생성된 회의 여부 화면 차이),회의 개설(로그인 유저),회의
        참여(비회원 가능이라 모달처럼? greyout이랑 뒤로가기)
      </a> */}
      {/* {!isLoggedIn && !inMeeting && ( */}
      <div>
        {selectedTab != "wait" && (
          <>
            <Nav
              variant="underline"
              className="pb-0"
              activeKey={"join"}
              style={{ fontSize: "20px" }}
              // defaultActiveKey="/dash/meeting/manage"
            >
              <Nav.Item
                onClick={() => {
                  handleTabClick("join");
                }}
                key={"join"}
              >
                <Nav.Link
                  style={{
                    color: selectedTab == "join" ? "#176DEE" : "#B9BEC6",
                  }}
                  active={selectedTab == "join"}
                  // disabled={(index == 3 && !hasAuth) || groups.length == 0}
                  eventKey={"join"}
                >
                  참여
                </Nav.Link>
              </Nav.Item>{" "}
              <Nav.Item
                onClick={() => {
                  handleTabClick("create");
                }}
                key={"create"}
              >
                <Nav.Link
                  style={{
                    color: selectedTab == "create" ? "#176DEE" : "#B9BEC6",
                  }}
                  active={selectedTab == "create"}
                  // disabled={(index == 3 && !hasAuth) || groups.length == 0}
                  eventKey={"create"}
                >
                  생성
                </Nav.Link>
              </Nav.Item>
              <Nav.Item
                onClick={() => {
                  handleTabClick("manage");
                }}
                key={"manage"}
              >
                <Nav.Link
                  style={{
                    color: selectedTab == "manage" ? "#176DEE" : "#B9BEC6",
                  }}
                  active={selectedTab == "manage"}
                  // disabled={(index == 3 && !hasAuth) || groups.length == 0}
                  eventKey={"manage"}
                >
                  관리
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <hr className="solid" />
          </>
        )}

        {/* <div class="border-top my-2"></div> */}
      </div>
      {/* )} */}
      {selectedTab == "create" && <Start></Start>}
      {selectedTab == "join" && <Join></Join>}
      {selectedTab == "manage" && <Manage></Manage>}
      {/* <Outlet></Outlet> */}

      {selectedTab == "wait" && <OpenVidu handle={handleBackToMeeting} ></OpenVidu>}

    </>
  );
}

export default Meeting;
