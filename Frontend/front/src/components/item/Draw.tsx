import React, { useState } from "react";

import draw from "../../assets/DrawCard.svg"; // 경로를 수정하여 import
import { Button, Modal } from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";
import { checkTickets } from "../../store/user";
import { getRandomItem } from "../../api/item/itemApi";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/user";
import { Item, addItem } from "../../store/item";
import choose from "../../assets/choose.png";
import colors from "../../assets/rainbow.png";
import pass from "../../assets/pass.png";

// <!-- import draw from "../../assets/draw_ticket.png"; // 경로를 수정하여 import -->

function Draw() {
  const [buttonClicked, setButtonClicked] = useState(false);
  const dispatch = useDispatch();
  const [modalShow, setShow] = useState(false);
  const [picked, pick] = useState<Item>();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // const ticket = useAppSelector(checkTickets);
  const user = useSelector(selectUser);
  console.log("user : ", user);
  const handleButtonClick = async () => {
    // 버튼을 누르면 함수 실행
    setButtonClicked(true);
    // setShow(true);
    try {
      // getRandomItem 함수 호출
      const response = await getRandomItem(); // getRandomItem 함수를 실행하고 응답을 받음
      console.log(response);
      // 추가적인 동작을 수행 (아이템 뽑기 성공 등)
      dispatch(checkTickets(user.ticket - 1));
    //   console.log("response = ", response);
    //   console.log(response.data);
      const newItem = response.data.data;
      const item: Item = {
        name: newItem.name,
        image: newItem.image,
        itemTypeId: newItem.itemTypeId,
        itemTypeName: newItem.itemTypeName,
        description: newItem.description,
      };
      dispatch(addItem(item));
      pick(item);
      handleShow();
    } catch (error) {
    //   console.error("Error while getting random item:", error);
      // 실패 시에 대한 처리 (예: 오류 메시지 표시)
    }
  };

  const getColor = (colorName: string) => {
    switch (colorName) {
      case "빨간색":
        return "red";
      case "주황색":
        return "orange";
      case "노란색":
        return "yellow";
      case "초록색":
        return "green";
      case "파란색":
        return "blue";
      case "남색":
        return "indigo";
      case "보라색":
        return "purple";

      default:
        return "black";
    }
  };
  //   const colorStyle :React.CSSProperties={
  //     color:
  //   }
  const DrawModal = () => {
    return (
      <>
        <Modal
          show={modalShow}
          className="font-SUIT"
          centered
          style={{}}
          size="sm"
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title className="">아이템 뽑기 성공</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center text-lg">
            <div
              className="items-center d-flex flex-column align-items-center"
              style={{
                padding: picked?.itemTypeId === 3 ? "60px" : "10px",
                fontSize: picked?.itemTypeId === 3 ? "100px" : "40px",
              }}
            >
              {picked?.itemTypeId === 1 ? (
                <img width="130px" style={{ margin: "0" }} src={choose}></img>
              ) : picked?.itemTypeId === 2 ? (
                <img width="130px" style={{ margin: "0" }} src={pass}></img>
              ) : picked?.itemTypeId === 4 ? (
                <div>
                  <img
                    width="130px"
                    className="pb-4"
                    style={{ margin: "0" }}
                    src={colors}
                  ></img>
                  <div style={{ color: getColor(picked.name),paddingBottom:"10px" }}>
                    {" "}
                    {picked.name}
                  </div>
                </div>
              ) : (
                picked?.name
              )}
            </div>
            <b>
              {picked?.itemTypeName == "emoji"
                ? "이모티콘"
                : picked?.itemTypeName}
            </b>
            을 뽑았습니다!
            {/* |{picked?.description} | {picked?.image} |
            {Number(picked?.itemTypeId)} |{picked?.itemTypeName} */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontWeight: "normal",
            color: "black",
            marginBottom: "5px",
            fontSize: "1.2rem",
          }}
        >
          <span style={{ color: "black" }}>회의에서 사용할 수 있는</span>{" "}
          <span style={{ color: "blue" }}>아이템</span>을 뽑아보세요!
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            position: "relative",
          }}
        >
          {" "}
          <img
            src={draw}
            alt="아이템 뽑기"
            style={{ maxWidth: "300px", maxHeight: "420px" }}
          />
          <div
            style={{
              position: "absolute",
              top: "65%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h4
              style={{
                marginTop: "20px",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
            >
              × {user.ticket}
            </h4>
            <Button
              style={{
                borderRadius: "80px",
                width: "150px",
                marginTop: "60px",
                background: "#FFCE1F",
                border: "2px solid #FFCE1F", // 테두리 색상 변경
              }}
              onClick={handleButtonClick}
            >
              뽑기!&nbsp;&nbsp; ×1
            </Button>
          </div>
        </div>
      </div>
      <DrawModal></DrawModal>
      {buttonClicked && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {/* <p>아이템 뽑기 성공!</p> */}
          
          {/* 추가적인 내용을 여기에 추가가능 */}
        </div>
      )}
    </>
  );

}

export default Draw;
