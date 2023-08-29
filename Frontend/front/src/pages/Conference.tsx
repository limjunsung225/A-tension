import { Col, Row } from "react-bootstrap";
import Toolbar from "../components/stream/Toolbar";
import { useAppDispatch } from "../store/hooks";
import { hideBackground } from "../store/test";
/*
this.state = {
    mySessionId: 'SessionA',
    myUserName: 'Participant' + Math.floor(Math.random() * 100),
    session: undefined,
    mainStreamManager: undefined, // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
    publisher: undefined,
    subscribers: [],
};
//https://docs.openvidu.io/en/stable/tutorials/openvidu-react/
*/
interface Props {
  sessionId: string;
  myUserName: string;
}

const Conference = (props: Props) => {
  const { sessionId, myUserName } = props;
  const dispatch = useAppDispatch();
  dispatch(hideBackground(true));
  //open vidu 적용되는 부분이라 집중적으로 공부하고 구조 고민하기
  return (
    <>
      회의실 세션ID: {sessionId}
      사용자: {myUserName}
      {/* <p>사이드 바 + 비디오 메인창 + 채팅/보드/기타</p> */}
      오픈비두 컴포넌트 들어갈것,,
      <Row>
        <Col sm={9}><Toolbar></Toolbar></Col>
        <Col sm={3}>chatting</Col></Row>
        {" "}       
          {/* <Row style={{ height: props.height }}>{props.children}</Row> */}

    
    
    </>
  );
};

export default Conference;
