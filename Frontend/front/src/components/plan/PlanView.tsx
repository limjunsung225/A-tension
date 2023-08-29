import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { Plan, editedPlans, planCreateTest } from "../../store/plan";
import { PlanRequestDto, PlanResponseDto } from "../../api/plan/types";
import back from "../../assets/arrow-left.svg";
import { deletePlan, getPlan, updatePlan } from "../../api/plan/planApi";

// interface Plan {
//   // name:string;
//   // members?: User[] | string[] | Team["teamId"]; // axios에서 생성 요청시 자동반환
//   name: string;
//   members?: string[]; //email 목록으로 일단 진행
//   // startdate: string;
//   startTime: string;
//   endTime: string;
//   // end?: string;
//   description: string;
// }
interface Props {
  planToView?: PlanResponseDto;
  navigate: (goto: string) => void;
}
function PlanView(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  // const getGroup = location.state?.propgroup;
  // const getPlan = location.state?.plan;
  // navigate('/dash/meeting/wait', { state: { data: dataObject } });

  const [planData, setPlanData] = useState<PlanResponseDto>(props?.planToView);

  const [isEdit, setMode] = useState(false);

  const dispatch = useAppDispatch();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPlanData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlePlanEdit = async () => {
    // 여기에 data 를 가지고
    if (confirm("일정을 수정하시겠습니까")) {
      await updatePlan<PlanRequestDto>(planData.id, planData);
      await getPlan<PlanResponseDto>(planData.id).then((result) => {
        dispatch(editedPlans(result.data.data));
        setPlanData(result.data.data);
      });
      setMode(false);
      console.log("plan updated");
    }
  };
  const handlePlanDelete = async () => {
    // 여기에 data 를 가지고
    if (confirm("일정을 삭제하시겠습니까")) {
      await deletePlan<PlanResponseDto>(planData.id,planData);
      setMode(false);
      console.log("deleted");
      navigate("/dash/calendar", { state: { tab: "calendar" } });
    }
  };
  const handleBack = () => {
    if (!location.state.group) {
      navigate("/dash/calendar", { state: { tab: "calendar" } });
    } else {
      navigate(-1);
    }
  };
  return (
    <>
      <img
        src={back}
        style={{ width: "30px", marginBottom: "1rem" }}
        onClick={handleBack}
      ></img>
      {/* <h1>일정 상세조회, 받아온 데이터를 value로 두고 고침</h1> */}
      <Form>
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
              defaultValue={planData.name}
              disabled={!isEdit}
              readOnly={!isEdit}
              size="lg"
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              type="text"
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
              disabled={!isEdit}
              readOnly={!isEdit}
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
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalDate">
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
              disabled={!isEdit}
              readOnly={!isEdit}
              name="startdate"
              defaultValue={planData.startTime}
              size="lg"
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              type="dateTime-local"
              className="input-border-radius-lg"
              form="rounded"
              onChange={handleInputChange}
            />
          </Col>
          <Form.Label
            disabled={!isEdit}
            readOnly={!isEdit}
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
              name="starttime"
              defaultValue={planData.endTime}
              size="lg"
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              type="dateTime-local"
              className="rounded-9"
              onChange={handleInputChange}
              disabled={!isEdit}
              readOnly={!isEdit}
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
              defaultValue={planData.description}
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
              onChange={handleInputChange}
              disabled={!isEdit}
              readOnly={!isEdit}
            />
          </Col>
        </Form.Group>

        {/* <Form.Group as={Row} className="mb-3"> */}
        <Col
          sm={{ span: 10 }}
          style={{
            display: "flex",
            // padding: "8.012px 40.063px",
            justifyContent: "left",
            alignItems: "center",
            gap: "6.6px",
          }}
        >
          {isEdit && (
            <Button
              variant="primary"
              style={{
                borderRadius: "20px",
                width: "100px",
                height: "40px",
              }}
              onClick={handlePlanEdit}
            >
              확인
            </Button>
          )}
          {!isEdit && (
            <Button
              variant="outline-primary"
              style={{
                borderRadius: "20px",
                width: "100px",
                height: "40px",
              }}
              onClick={() => setMode(true)}
            >
              수정
            </Button>
          )}
          <Button
            style={{
              borderRadius: "20px",
              width: "100px",
              height: "40px",
            }}
            type="reset"
            variant="danger"
            onClick={handlePlanDelete}
          >
            삭제
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

export default PlanView;
