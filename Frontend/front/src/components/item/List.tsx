import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import imoticon from "../../assets/imoticon.png";
import choose from "../../assets/choose.png";
import pass from "../../assets/pass.png";
import rainbow from "../../assets/rainbow.png";

import { selectUser } from "../../store/user"; // selectUser 추가
import { Item } from '../../store/item'; 
import { User } from '../../store/user'; 
import { getItems } from "../../store/item";
function List() {
  // useSelector를 사용하여 Redux 스토어의 상태 가져오기
  const user = useSelector(selectUser);
  // user 객체에서 myItems 배열 가져오기
  const myitems = useSelector(getItems);
  // user 객체에서 myItems 배열 가져오기
  console.log("my Items:", myitems);
  console.log("user items :", user.myItems);

  const itemTypesCount = {}; // 각 itemType의 개수를 담을 객체 생성

  // myItems 배열 반복하여 각 itemType의 개수 카운트
  myitems.forEach((item) => {
    const { itemTypeId } = item;
    if (itemTypeId) {
      // itemTypeId가 존재하는 경우에만 처리
      if (!itemTypesCount[itemTypeId]) {
        // 해당 itemType이 처음 나온 경우, 초기값 설정
        itemTypesCount[itemTypeId] = 1;
      } else {
        // 해당 itemType이 이미 나온 경우, 개수 증가
        itemTypesCount[itemTypeId]++;
      }
    }
  });

  const listStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "flex-start",
    gap: "28px",
    marginTop:"20px"
  };
  const grayBoxStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "150px",
    height: "150px",
  flexShrink: "0",
    
  };

  const imageStyle: React.CSSProperties = {
    width: "60px",
    height: "60px",
    marginBottom: "10px",
  };

  const textStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "bold",
  };

  return (
    <Container>
      <Row style={listStyle}>
        {/* 발표 지목권 */}
        {/* <Col style={{ marginTop: "10px" }}> */}
          <div style={grayBoxStyle}>
            <img src={choose} alt="발표 지목권" style={imageStyle} />
            <p style={textStyle}>발표 지목권</p>
            <p style={textStyle}>{itemTypesCount[1] || 0}개</p>
          </div>
        {/* </Col> */}
        {/* 발표 패스권 */}
        {/* <Col style={{ marginTop: "10px" }} sm={3}> */}
          <div style={grayBoxStyle}>
            <img src={pass} alt="발표 패스권" style={imageStyle} />
            <p style={textStyle}>발표 패스권</p>
            <p style={textStyle}>{itemTypesCount[2] || 0}개</p>
          </div>
        {/* </Col> */}
        {/* 이모티콘 */}
        {/* <Col style={{ marginTop: "10px" }} sm={3}> */}
          <div style={grayBoxStyle}>
            <img src={imoticon} alt="이모티콘" style={imageStyle} />
            <p style={textStyle}>이모티콘</p>
            <p style={textStyle}>{itemTypesCount[3] || 0}개</p>
          </div>
        {/* </Col> */}
        {/* 글씨 색상 */}
        {/* <Col style={{ marginTop: "10px" }} sm={3}> */}
          <div style={grayBoxStyle}>
            <img src={rainbow} alt="글씨 색상" style={imageStyle} />
            <p style={textStyle}>글씨 색상</p>
            <p style={textStyle}>{itemTypesCount[4] || 0}개</p>
          </div>
        {/* </Col> */}
      </Row>
    </Container>
  );
}

export default List;
