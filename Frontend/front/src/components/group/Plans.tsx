import { Button, Card, Col } from "react-bootstrap";
import { Team } from "../Group";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { addPlans, reloadPlans } from "../../store/plan";
import { PlanResponseDto } from "../../api/plan/types";
import { getTeamPlan } from "../../api/plan/planApi";
import { useEffect, useState } from "react";
interface Props {
  teamProp?: Team;
}
function Plans(props: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const goCreate = () => {
    navigate("/dash/calendar", { state: { group: props.teamProp, tab:"add" } });
  };

  const thisTeamId = props.teamProp?.teamId;

  const [groupPlan, setPlan] = useState<PlanResponseDto[]>([]);
  useEffect(() => {
    const loadGroupPlan = () => {
      if (thisTeamId) {
        //async await
       getTeamPlan<PlanResponseDto[]>(thisTeamId).then((result) => {
          //result 에 await 붙이고 async는 그걸 실행하는 큰 함수에
          console.log(result.data);
          const loadedGroupPlan = result.data.data;
          dispatch(reloadPlans(loadedGroupPlan));
          setPlan(loadedGroupPlan);
        });
      }
    };
    loadGroupPlan();
  }, [dispatch, props.teamProp, thisTeamId]);

  // const plans = useAppSelector(getPlanlist);

  const planList = groupPlan?.map((plan, index) => (
    <div
      // onClick={}
      key={index}
      style={{
        display: "flex",
        backgroundColor: "#ECF3FC",
        borderRadius: "6px",
        padding: "10px",
        marginBottom: "10px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        justifyContent: "space-between",
        // flex: "1",
      }}
    >
      <Col>
        {plan.startTime.replace(/T.*$/, "").replace(/-/g, ".")}{" "}
        {plan.endTime.slice(11, 16)}
      </Col>
      {/* <Col> </Col> */}
      <Col className="">{plan.name}</Col>
      {/* 일정 추가 내용 1 */}
    </div>
  ));
  return (
    <>
      {/* <h1> prop test {props.teamProp?.name}</h1> */}
      <Card
        style={{
          border: "none",
          marginTop: "-5px",
          padding: "10px",
          borderRadius: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <Button
            variant="primary"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "8px",
            }}
            onClick={goCreate}
          >
            일정 추가
          </Button>
        </div>

        {/* ... 이전 내용 ... */}
        <div>
          {planList}
          {!planList && (
            <div
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "6px",
                padding: "10px",
                marginBottom: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* 일정 추가 내용 1 */}
              일정이 없습니다.
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

export default Plans;
