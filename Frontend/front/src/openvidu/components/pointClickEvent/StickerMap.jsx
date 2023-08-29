import React, { useState } from "react";
import Sticker from "./PointSticker";

const PointSticker = (props) => {
  const { clickTimeOut, clickPoint, height, width } = props;
  let [stickers, setStickers] = useState([]);
  const addNewStickers = (e, multiple) => {
    for (let i = 0; i < multiple; i++) {
      addNewSticker(i);
    }
    setTimeout(() => {
      removeAllStickers();
    }, clickTimeOut * 1000);
  };

  const addNewSticker = (cur) => {
    // let imgSize = 100;
    // let margin = 8;
    // let xStart = margin + 140;
    // let xEnd = width - imgSize * 2;
    // let yStart = margin;
    // let yEnd = height - imgSize * 2;

    let imgSize = 100;
    let margin = 2;
    let xStart = 150;
    let xEnd = 150;
    let yStart = 150;
    let yEnd = 150;

    let newSticker = {
      key: cur,
      point: clickPoint,
      top: between(yStart, yEnd),
      left: between(xStart, xEnd),
    };
    setStickers((stickers) => [...stickers, newSticker]);
  };

  const removeAllStickers = (current) => {
    setStickers((stickers) => []);
  };

  const removeSticker = (current) => {
    setStickers((stickers) =>
      stickers.filter((sticker, index) => index !== current)
    );
  };

  const between = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <div id="pointSticker">
      <button onClick={(e) => addNewStickers(e, 3)}>+</button>
      <button onClick={removeSticker}>-</button>
      <button onClick={(e) => addNewStickers(e, 3)}>+</button>
      <button onClick={(e) => addNewStickers(e, 3)}>+</button>
      {stickers.map((stickerKey) => (
        <Sticker
          key={stickerKey.key}
          point={point}
          top={stickerKey.top}
          left={stickerKey.left}
        ></Sticker>
      ))}
    </div>
  );
};

export default PointSticker;
