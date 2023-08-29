import { Button, ListGroup, Nav } from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";
import { getPlanlist } from "../../store/plan";
import { Outlet } from "react-router-dom";

function Manage() {
  const planlist = useAppSelector(getPlanlist);
  const plans = planlist.map((plan, index) => (
    // <Nav.Item
    //   as={Nav.Link}
    //   eventKey={index}
    //   key={index}
    // >
    //   {plan.name} |
    // </Nav.Item>
    <ListGroup variant="flush">
      <ListGroup.Item
        key={index}
        style={{
          backgroundColor: "#f7f7f7",
          borderRadius: "6px",
          padding: "10px",
          marginBottom: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        // onClick={handleMember}
      >
        {plan.startdate} {plan.starttime}
      </ListGroup.Item>
      <ListGroup.Item
        key={`${index}+${plan.name}`}
        style={{
          // backgroundColor: "#f7f7f7",
          borderRadius: "6px",
          padding: "10px",
          marginBottom: "10px",
          // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        // onClick={handleMember}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{plan.name}</div>
          <div style={{}}>
            <Button
              style={{
                borderRadius: "20px",
                marginRight: "8px",
              }}
            >
              참여
            </Button>
            <Button
              style={{
                borderRadius: "20px",
                marginRight: "8px",
              }}
              variant="outline-secondary"
            >
              편집
            </Button>

            <Button
              style={{
                borderRadius: "20px",
              }}
              variant="outline-secondary"
            >
              삭제
            </Button>
          </div>
        </div>
      </ListGroup.Item>
    </ListGroup>
  ));
  return (
    <>
      {/* <h1>미팅 관리</h1> */}
      {plans}
    </>
  );
}

export default Manage;
