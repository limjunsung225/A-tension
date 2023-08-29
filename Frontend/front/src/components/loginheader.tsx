import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

import { getMode } from "../store/test";
const Loginheader = () => {
  const inMeeting = useAppSelector(getMode);

  return (
    <>
      {!inMeeting && (
        <>
          <Nav.Link
            className="text-white"
            as={Link}
            to="/dash/meeting/join"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            회의 참여
          </Nav.Link>
          <Nav.Link className="text-white" as={Link} to="login">
            로그인
          </Nav.Link>
        </>
      )}
    </>
  );
};
export default Loginheader;
