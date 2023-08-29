import "./toolbar.scss";
import ScreenPlaceholder from "../../assets/screenfiller.png";
import groupIcon from "../../assets/icons/icon_group.svg";
import IconComp from "../atoms/IconComp";
import { Button, OverlayTrigger, Popover, Ratio } from "react-bootstrap";
import ModalOverlay from "./ModalOverlay";
import { useAppDispatch } from "../../store/hooks";
import { meetingModeTest } from "../../store/test";
import { useNavigate } from "react-router-dom";
import Screen from "./Screen";
interface Tool {
  title: string;
  modal: boolean | false;
  actions: string[];
}
const Toolbar = () => {
  const tools = [
    "Message",
    "RaiseHand",
    "Emoticon",
    "Activity",
    "More",
    "ScreenShare",
    "CameraSwitch",
    "MicSwitch",
  ];

  const poptools = [
    {
      title: "Emoticon",
      modal: false,
      actions: ["emoticon1", "emoticon2", "emoticon3"],
    },
    {
      title: "Activity",
      modal: true,
      actions: ["퀴즈열기", "발표뽑기", "스트레칭"],
    },
    { title: "More", modal: true, actions: ["장치설정", "회의링크"] },
  ];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLeaving = () => {
    dispatch(meetingModeTest());
    navigate("/dash/meeting/");
  };
  const popbuttons = poptools.map((object: Tool) => (
    <div className="buttonwrap w-6 h-6 relative" key={object.title}>
      <OverlayTrigger
        trigger="click"
        placement="top"
        overlay={
          <Popover id={object.title}>
            <Popover.Body>
              (아이콘:설명)
              {object.modal && (
                <ModalOverlay
                  buttonLabel={object.title}
                  title={object.title}
                ></ModalOverlay>
              )}
            </Popover.Body>
          </Popover>
        }
      >
        <div className="buttonwrap w-6 h-6 relative">
          <IconComp Icon={groupIcon}></IconComp>
        </div>
      </OverlayTrigger>
    </div>
  ));

  return (
    <>
      <div className="media-container">
        {/* <Ratio aspectRatio={"16x9"} style={{ maxWidth: "600px" }}> */}
            <Screen audio={true} video={true}></Screen>
          {/* </Ratio> */}
   
        <div className="overlay inset-x-0 left- bottom-0 rounded-3xl backdrop-blur-md">
          {/* <div className="OpaqueToolbar w-96 h-12 justify-center items-center inline-flex"></div> */}
          {/* <div className="w-96 h-12 bg-white bg-opacity-70 md:bg-opacity-50 rounded-3xl backdrop-blur-md"></div> */}
          <div className="ToolbarOpaque tbstyle.opaqueToolbar">
            <div className="Frame7245 w-96 h-6 justify-start items-start gap-8 inline-flex">
              <div className="Frame7242 justify-start items-start gap-2 flex">
                {popbuttons}
                {/* <div className="Group2391 w-6 h-6 relative">
                  <div className="Ellipse144 w-6 h-6 left-0 top-0 absolute bg-white rounded-full" />
                  <div className="Messege w-4 h-4 left-[19.84px] top-[3.97px] absolute origin-top-left rotate-180" />
                </div>
                <div className="Group2393 w-6 h-6 relative">
                  <div className="Ellipse144 w-6 h-6 left-0 top-0 absolute bg-white rounded-full" />
                  <div className="RaiseHand w-4 h-4 left-[19.84px] top-[3.97px] absolute origin-top-left rotate-180" />
                </div>

                <div className="buttonwrap w-6 h-6 relative">
                  <div className=" w-6 h-6 left-0 top-0 absolute bg-white rounded-full" />
                  <div className="Emoticon w-4 h-4 left-[19.84px] top-[3.97px] absolute origin-top-left rotate-180" />
                </div>

                <div className="buttonwrap w-6 h-6 relative">
                  <IconComp Icon={groupIcon}></IconComp>
                </div> */}
              </div>
              <div className="Group2388 w-6 h-6 relative">
                <div className="Ellipse148 w-6 h-6 left-0 top-0 absolute bg-blue rounded-full" />
                <div className="More w-4 h-4 px-1.5 left-[19.84px] top-[3.97px] absolute origin-top-left rotate-180 justify-center items-center inline-flex">
                  <div className="Frame7214 self-stretch justify-start items-start gap-px inline-flex" />
                </div>
              </div>
              <div className="Frame7243 justify-start items-start gap-2 flex">
                <div className="Group2391 w-6 h-6 relative">
                  <div className="Ellipse144 w-6 h-6 left-0 top-0 absolute bg-white rounded-full" />
                  <div className="ScreenShare w-4 h-4 left-[19.84px] top-[3.97px] absolute origin-top-left rotate-180" />
                </div>
                <div className="Group2386 w-6 h-6 relative">
                  <div className="Ellipse150 w-6 h-6 left-0 top-0 absolute bg-red rounded-full" />
                  <div className="CameraOff w-4 h-4 left-[19.84px] top-[3.97px] absolute origin-top-left rotate-180" />
                </div>
                <div className="Group2392 w-6 h-6 relative">
                  <div className="Ellipse144 w-6 h-6 left-0 top-0 absolute bg-white rounded-full" />
                  <div className="Mic w-4 h-4 left-[20.18px] top-[4.20px] absolute origin-top-left rotate-180" />
                </div>
                <div
                  className=" px-4 py-1.5 bg-red rounded-3xl justify-center items-center gap-1.5 flex"
                  onClick={handleLeaving}
                >
                  <div
                    className="Leave text-white  font-semibold leading-3"
                    style={{ fontSize: "10px" }}
                  >
                    나가기
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Toolbar;
