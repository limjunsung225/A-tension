import { css } from "@emotion/react";
import React, { useState } from "react";
import "./PointSticker.css";
import ghostPng from "../toolbar/iconComponents/img/ghostIcon.png";

// name: 김민석
// date: 2023/08/09
// desc: 클릭하면 포인트를 얻는 컴포넌트
// Todo: 호출 시 현재 유저의 개인 화면에 랜덤한 위치에 생성되고, 클릭한 유저에게 props로 전달받은 만큼의 포인트를 반환해준다.
const PointSticker = (props) => {
  const { stikerKey, top, removeSticker, localUser } = props;
  const [visible, setVisible] = useState(true);
  const size = "100px";

  const stickerCSS = css`
    position: relative;
    top: ${top + "px !important"};
    left: ${Math.floor(Math.random(1, 100)) + "px !important"};
    border-radius: "50%";
    cursor: "pointer";
    visibility: ${visible ? "visible" : "hidden"};
    /* color: red; */
    img {
      width: ${size} + " !important";
      max-width: ${size} + " !important";
      min-width: ${size} + " !important";
      height: ${size} + " !important";
      max-height: ${size} + " !important";
      min-height: ${size} + " !important";
      /* border: red solid 1px; */
      /* background-color: white; */
    }
  `;

  const addPoint = () => {
    removeSticker(stikerKey);
    localUser.getStreamManager().stream.session.signal({
      to: [localUser],
      type: "point-up",
    });
    setVisible(false);
  };

  return (
    <div id="pointSticker" css={stickerCSS}>
      <img
        alt="집중 스티커"
        src={ghostPng}
        onClick={addPoint}
        disabled={!visible}
      />
    </div>
  );
};

export default PointSticker;
