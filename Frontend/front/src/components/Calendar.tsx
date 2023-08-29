import { Link, useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { getPlanlist, loadListTest } from "../store/plan";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import "../components/plan/cal.css";
import { useEffect, useMemo, useState } from "react";
import Month from "./plan/Month";
import { EventInput } from "@fullcalendar/core/index.js";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Planner from "./plan/Planner";
import PlanView from "./plan/PlanView";
import { createEventId } from "./plan/event-utils";
import { PlanRequestDto, PlanResponseDto } from "../api/plan/types";

function Calendar() {
  const navigate = useNavigate();

  const location = useLocation();
  const propgroup = location.state?.propgroup;

  // destination = location.state?.tab;
  const tabFromState = useMemo(
    () => location.state?.tab,
    [location.state?.tab]
  );
  const planFromGroup = location.state?.plan;
  const [selectedTab, selectTab] = useState(tabFromState || "calendar");

  const [gotPlan, getPlan] = useState<PlanResponseDto>(planFromGroup);
  const planTransfer = (sPlan:PlanResponseDto) => {
    getPlan(sPlan);
  };

  // const dataObject = useAppSelector(getPlanlist); // Use the selector to access the data

  const planData = useAppSelector(getPlanlist);
  useEffect(() => {
    console.log(planData)
  
  }, [])
  
  // const dispatch = useDispatch();
  const navigateSelector = (goto: string) => {
    console.log("outside function call go to" + goto);
    // navigate("/dash/calendar/add");
    // if (goto == "group") {
    //   navigate("/dash/group");
    // }
    selectTab(goto);

    // selectTab("add");
  };
  useEffect(() => {
 
 
  }, [selectedTab])
  
  // consst planHandler = (selected:PlanRequestDto)=>{
  //   selectCreatedPlan(selected);
  // }
  // This is where you process the data from Redux into EventInput format
  const eventData: EventInput[] = planData.map((plan) => ({
    id: plan.id || createEventId(), // Assuming plan.id is optional //사용자가 입력하는 부분이 아님
    title: plan.name,
    start: plan.startTime.replace(/T.*$/, ""),
    startTime: plan.startTime,
    groupId: plan.teamId,
    endTime: plan.endTime,
    end: plan.endTime.replace(/T.*$/, ""), // Use the appropriate property from your data
    // ...other properties you need to set
    extendedProps: {
      description: plan.description,
      teamName: plan.teamName,
      profileImage: plan.profileImage,
    },
  }));

  // useEffect(() => {
  // dispatch(loadListTest());
  // }, [dispatch]);
  return (
    <>
      {/* <h1>캘린더</h1> */}
      <a>
        {/* 달력화면에서 툴팁으로 일정 보여주기, 일정추가(뒤로가기 달력화면),
        일정상세 */}
      </a>
      <div>
        {selectedTab == "add" && (
          <Planner navigate={navigateSelector}></Planner>
        )}
        {selectedTab == "planView" && (
          <PlanView planToView={gotPlan} navigate={navigateSelector}></PlanView>
        )}
        {selectedTab === "calendar" && (
          <Month
            navigate={navigateSelector}
            selectPlan={planTransfer}
            planData={eventData}
          ></Month>
        )}

        {/* <Link to="add">일정추가</Link>
        <Link to="plan">일정상세</Link>
        <Link to="">캘린더</Link>
        <Outlet></Outlet> */}
        {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
        {/* {selectedTab=="calendar" && <Month></Month>} */}
      </div>
    </>
  );
}

export default Calendar;
