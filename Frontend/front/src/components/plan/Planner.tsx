import { Button, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { Plan, planCreateTest, reloadPlans } from "../../store/plan";
import { Team } from "../../store/group";
import back from "../../assets/arrow-left.svg";
import { userProfileDto } from "../../api/team/types";
import { createEventId } from "./event-utils";
import { PlanRequestDto } from "../../api/plan/types";
import { createTeamPlan, findMyPlan } from "../../api/plan/planApi";

//시간 나면 할 것: 유효성 검사 -> 시작시간이 종료시간보다 늦을 수 없다

interface Props {
  // planHandler: (selected: PlanRequestDto) => void;
  navigate: (goto: string) => void;
  group?: Team;
  // selectTab:()=>void;
}
function Planner(props: Props) {
  const location = useLocation();
  const propgroup = location.state?.group;

  const navigate = useNavigate();

  const [planData, setPlanData] = useState<PlanRequestDto>({
    name: "",
    startTime: "", //`${defaultDate}T${defaultTime}`,
    endTime: "",
    description: "",
    teamId: propgroup?.teamId, //사용자 입력으로 받을 수 없는 것 //extendedProps.teamId
  });

  const dispatch = useAppDispatch();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPlanData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // const handleSubmitForm = (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   console.log("now go to calendar and show planview");

  //   console.log(planData);
  //   // dispatch(planCreateTest(planData));
  //   // props.selectTab()
  //   // if (propgroup) {
  //   // navigate("/dash/group",{state:{group:propgroup}})
  //   navigate("/dash/calendar", {
  //     state: { plan: planData, propgroup: propgroup, tab: "planView" },
  //   });
  //   // } else {
  //   //  navigate("/dash/calendar/plan",{state:{plan:planData}});
  //   // }
  // };
  const handleSubmitForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    await createTeamPlan(planData);
    console.log("now go to calendar and show planview");

    console.log(planData);
    // dispatch(planCreateTest(planData));

    await findMyPlan().then((result) => {
      dispatch(reloadPlans(result.data.data));
    });
    console.log("called submit actions, create and reload");
    // props.navigate("planView");
    props.navigate("calendar");
    // navigate("/dash/calendar", { state: { tab: "calendar" } });
  };

  const handleBack = () => {
    if (!location.state?.group) {
      props.navigate("calendar");
    } else {
      // navigate(-1);

      navigate("/dash/group");
    }
  };
  return (
    <>
      <img
        src={back}
        style={{ width: "30px", marginBottom: "1rem", marginTop:"1rem" }}
        onClick={handleBack}
      ></img>
      <Form>
        <i className="bi bi-arrow-left"></i>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
          <Form.Label
            column
            sm={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
            }}
          >
            <div>제목</div>
          </Form.Label>
          <Col sm={11}>
            <Form.Control
              name="name"
              value={planData.name}
              size="lg"
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              type="text"
              placeholder="일정 제목을 입력하세요"
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
        {/* <Form.Group as={Row} className="mb-3" controlId="formHorizontalMembers">
          <Form.Label
            column
            sm={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
            }}
          >
            초대
          </Form.Label>
          <Col sm={11}>
            <Form.Control
              name="members"
              value={planData.members?.join(",")}
              size="lg"
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              type="text"
              accept="multiple"
              placeholder="인원을 쉼표 ','로 구분하세요"
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group> */}
        <Form.Group as={Row} className="mb-3" controlId="formStartDate">
          <Form.Label
            column
            sm={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
            }}
          >
            시작
          </Form.Label>
          <Col sm={5}>
            <Form.Control
              name="startTime"
              defaultValue={planData.startTime}
              size="lg"
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              type="dateTime-local"
              placeholder=""
              className="input-border-radius-lg"
              form="rounded"
              onChange={handleInputChange}
            />
          </Col>
          <Form.Label
            column
            sm={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
            }}
          >
            종료
          </Form.Label>
          <Col sm={5}>
            <Form.Control
              name="endTime"
              defaultValue={planData.endTime}
              size="lg"
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              type="dateTime-local"
              placeholder=""
              className="rounded-9"
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
          <Form.Label
            column
            sm={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              fontSize: "20px",
            }}
          >
            <div>내용</div>
          </Form.Label>
          <Col sm={11}>
            <Form.Control
              name="description"
              value={planData.description}
              className="text-start"
              size="lg"
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              as="textarea"
              rows={5}
              placeholder="내용을 입력하세요"
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>

        <Col
          sm={{ span: 11,offset:1 }}
          style={{
            display: "flex",
            // padding: "8.012px 40.063px",
            justifyContent: "left",
            alignItems: "center",
            gap: "6.6px",
          }}
        >
          <Button
            style={{
              borderRadius: "20px",
              width: "100px",
              height: "40px",
            }}
            type="submit"
            onClick={handleSubmitForm}
          >
            생성
          </Button>
          <Button
            style={{
              borderRadius: "20px",
              width: "100px",
              height: "40px",
            }}
            type="reset"
            variant="outline-primary"
          >
            취소
          </Button>
        </Col>
      </Form>

      {/* <div className=" w-96 h-96 flex-col justify-center items-start gap-8 inline-flex">

      </div> */}
      {/* <a>
      개인 일정 + 그룹일정 , 어디서 들어왔는지,, props로 받기?
      </a> */}
    </>
  );
}

export default Planner;
