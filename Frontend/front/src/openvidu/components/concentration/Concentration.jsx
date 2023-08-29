import React, { useState, useEffect } from "react";
import "./Concentration.css";
import {
    OverlayTrigger,
    Button,
    Tooltip,
    Image,
    Popover,
} from "react-bootstrap";
import Screen from "../../../components/stream/Screen";
import "../../../components/stream/toolbar.scss";
import focus from "../../assets/icons/focus_icon.png";
import smileIcon from "../../assets/icons/smile_emoji.svg";
import meh from "../../assets/icons/meh_emoji.svg";
import sleep from "../../assets/icons/sleep_emoji.svg";
import info from "../../assets/icons/info_icon.svg";
const Concentration = (props) => {
    const { people, display, toggleConcentrationMenu, total, concentration, concentrationList, smile, outAngle } = props;
    let good = 0;
    let normal = props.people;
    let bad = 0;

    // console.log(concentrationList)
    if (concentrationList !== undefined) {
        // if (concentrationList[3] === 0 &&
        //     concentrationList[4] === 0 &&
        //     concentrationList[5] === 0
        // )
        //     concentrationList[4]++;
        if (concentrationList[3] < 0) {
            concentrationList[3]++;
            concentrationList[4]--;
        }
        else if (concentrationList[4] < 0) {
            concentrationList[3]--;
            concentrationList[4]++;
        }
    }
    switch (concentration) {
        case 3: // normal => smile
            normal -= 1;
            good += 1;
            break;
        case 4: // 자리비움 => smile
            bad -= 1;
            good += 1;
            break;
        case 5: // smile => normal
            good -= 1;
            normal += 1;
            break;
        case 6: // 자리비움 => normal
            bad -= 1;
            normal += 1;
            break;
        case 7: // normal => 자리비움 
            normal -= 1;
            bad += 1;
            break;
        case 8: // smile => 자리비움 
            good -= 1;
            bad += 1;
            break;
        default:
            break;
    }

    // if (!total) {
    //   total = 0;
    //   // display = true;
    // }
    // if (!concentrationList) {
    //   concentrationList = [1, 1, 1];
    // }
    // const [show, setUp] = useState();
    // useEffect(() => {
    //   if (display) {
    //     setUp(display);
    //   }
    // }, [display]);

    const iconList = [smileIcon, meh, sleep];

    const onClickConcentration = () => {
        console.log("clicked");

        // setUp(false);
        toggleConcentrationMenu();
    };
    const popupStyle = {
        zIndex: 99999,
        width: "500px!important",
        height: "auto",
    };

    const popover = (
        <Popover className="popover-info">

            <Popover.Body as="div" className="popover-info">
                <div className="popover-info" width="300px">
                    집중도 수치에 따른 가이드 라인을 보여줍니다.
                    <div
                        className="toolbar-pill-list"
                        style={{ justifyContent: "start" }}
                    >
                        <div
                            className="pills"
                            style={{
                                backgroundColor: "#006BE5",
                                color: "white",
                                // width: "auto",
                            }}
                        >
                            <div
                                className="pill-text"
                                style={{
                                    fontSize: "11px",
                                    color: "white",
                                    width: "auto",
                                }}
                            >
                                80점 이상
                            </div>
                        </div>
                        양호합니다. 좋은 발표력이네요!
                    </div>
                    <div
                        className="toolbar-pill-list"
                        style={{ justifyContent: "start" }}
                    >
                        <div
                            className="pills"
                            style={{
                                backgroundColor: "#3CB043",
                            }}
                        >
                            <div
                                className="pill-text"
                                style={{
                                    color: "white",
                                    width: "auto",
                                    fontSize: "11px",
                                    alignItems: "center",
                                }}
                            >
                                60 ~ 79점
                            </div>
                        </div>
                        평균적인 집중도입니다.
                    </div>
                    <div
                        className="toolbar-pill-list"
                        style={{ justifyContent: "start" }}
                    >
                        <div
                            className="pills"
                            style={{
                                backgroundColor: "#F1414F",
                                color: "white",
                            }}
                        >
                            <div
                                className="pill-text"
                                style={{
                                    color: "white",
                                    width: "auto",
                                    fontSize: "11px",
                                }}
                            >
                                59점 이하
                            </div>
                        </div>
                        집중을 위해 청중과 상호작용은 어떨까요?
                    </div>
                </div>
            </Popover.Body>
        </Popover>
    );
    //움직이는 법
    //초기 위치
    // const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
    // const [toolbarPosition, setToolbarPosition] = useState({
    //   x: 0, //window.innerWidth / 2 - 205.05,
    //   y: 0//window.innerHeight - 60 - 10,
    // });
    // Set initial position in the middle of the page
    //544
    //
    const initialX = (window.innerWidth - 456) / 2; // Assuming toolbar width is 456px
    const initialY = (window.innerHeight) * (0.75); // Assuming toolbar height is 76px

    // const [toolbarPosition, setToolbarPosition] = useState({
    //   x: initialX,
    //   y: initialY,
    // });

    //스타일

    const opaqueStyle = {
        width: "470px",
        height: "76px",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: "66px",
        backdropFilter: "blur(13.23px)",
        position: "absolute",
        top: initialY + "px",
        left: initialX + "px",
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
    };

    return (
        <>
            {/* <div><Screen audio={false} video={true}></Screen></div> */}
            {display && (
                <div
                    // display={}
                    // className="concentration-toolbar"
                    id="tooltip-toolbar-info"
                >
                    {/* <Screen audio={false} video={true}></Screen> */}
                    <div style={opaqueStyle} className="concentration-toolbar" display={display}>
                        <div className="toolbar-pill-list ">
                            <OverlayTrigger trigger="hover" placement="top" overlay={popover}>
                                {
                                    <div className="pills">
                                        <div className="pill-text">집중도</div>
                                        <div className="pill-text">{total}</div>
                                    </div>
                                }
                            </OverlayTrigger>
                            <div className="pills">
                                <div className="pill-text">
                                    <img className="icon-block" src={iconList[0]} alt="Icon 0" />
                                    {concentrationList === undefined ? 0 : concentrationList[3]}
                                </div>
                            </div>

                            <div className="pills">
                                <div className="pill-text">
                                    <img className="icon-block" src={iconList[1]} alt="Icon 1" />
                                    {concentrationList === undefined ? 0 : concentrationList[4]}
                                </div>
                            </div>

                            <div className="pills">
                                <div className="pill-text">
                                    <img className="icon-block" src={iconList[2]} alt="Icon 2" />
                                    {concentrationList === undefined ? 0 : concentrationList[5]}
                                </div>
                            </div>

                            <div className="pills" onClick={onClickConcentration}>
                                <button className="pill-text">닫기</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Concentration;