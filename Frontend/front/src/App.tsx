import { Routes, Route, Navigate } from "react-router-dom";
import Conference from "./pages/Conference";
import Dash from "./pages/Dash";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Group from "./components/Group";
import Calendar from "./components/Calendar";
import Meeting from "./components/Meeting";
import Item from "./components/Item";
import Info from "./pages/Info";
import Join from "./components/meeting/Join";
import Start from "./components/meeting/Start";
import Planner from "./components/plan/Planner";
import PlanView from "./components/plan/PlanView";
import Manage from "./components/meeting/Manage";
import Header from "./pages/Header";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler.tsx";
// import Month from "./components/plan/Month";
import "./App.css";
import JoinMeeting from "./components/JoinMeeting";
import Waiting from "./pages/Waiting";
import List from "./components/item/List.tsx";
import Draw from "./components/item/Draw.tsx";
import OpenVidu from "./openvidu/App.jsx";

import Create from "./components/meeting/Create.tsx";
// import CalendarView from "./components/plan/CalendarView.tsx";
import { useAppSelector } from "./store/hooks.ts";
import { title } from "process";
import { createEventId } from "./components/plan/event-utils.tsx";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { EventInput } from "@fullcalendar/core/index.js";

function App() {
  //임시 props 테스트
  //요소 스크롤
  const featureRef = useRef(null);
  const introRef = useRef(null);
  const scrollTo = (ref: React.RefObject<HTMLImageElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  // tab으로 전환 시키기 위한 function

  return (
    <>
      <div className="font-SUIT">
        <Header
          scrollToFeatures={() => scrollTo(featureRef)}
          scrollToIntro={() => scrollTo(introRef)}
        ></Header>
        <Routes>
          <Route path="/conference" element={<JoinMeeting />}></Route>
          <Route
            path="/"
            element={<Landing featureRef={featureRef} introRef={introRef} />}
          ></Route>
          <Route path="/dash" element={<Dash />}>
            <Route path="" element={<Navigate to="group" />}></Route>
            <Route path="group" element={<Group />}></Route>
            <Route path="calendar" element={<Calendar />}>
              //일정 추가는 그룹일정에서 추가하러 옴,,
              {/* <Route index element={<Month />}></Route> */}
              {/* <Route path="month" element={<Month />}></Route> */}
            </Route>

            <Route path="meeting" element={<Meeting />}>
              <Route path="" element={<Navigate to="join" />}></Route>
              <Route path="join" element={<Join />}></Route>

              <Route path="joinmeeting" element={<JoinMeeting />}></Route>
              {/* <Route path="openvidu" element={<OpenVidu />}></Route> */}
              {/*<Route path="conference" element={<VideoRoomComponent />}></Route>*/}
            </Route>
            <Route path="item" element={<Item />}>
              <Route path="" element={<Navigate to="list" />}></Route>
              <Route path="list" element={<List />}></Route>
              <Route path="draw" element={<Draw />}></Route>
            </Route>
            <Route path="item" element={<Item />}></Route>
          </Route>
          <Route path="join" element={<JoinMeeting />}></Route>//굳이?
          <Route path="/info" element={<Info />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/oauth2/redirect"
            element={<OAuth2RedirectHandler />}
          ></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
