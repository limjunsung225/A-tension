import { css } from "@emotion/react";
import Shuffle from "@material-ui/icons/Shuffle";
import Quiz from "@material-ui/icons/HelpOutline";
import AccessTime from "@material-ui/icons/AccessTime";
import IconButton from "@material-ui/core/IconButton";
import StretchingIcon from "./iconComponents/StretchingIcon";
import GhostIcon from "./iconComponents/GhostIcon";
import QuizIcon from "./iconComponents/QuizIcon";
import RandomIcon from "./iconComponents/RandomIcon";
import PieChart from "@material-ui/icons/PieChart";

// 게임 누르면
const TeachersToolbar = ({
  display,
  pickRandomStudent,
  randAvailable,
  startStickerEvent,
  toggleStretching,
  stickerAvailable,
  toggleQuiz,
  toggleTeacherMenu,
  toggleConcentrationMenu,
}) => {
  const onClickRandomPick = () => {
    pickRandomStudent();
    toggleTeacherMenu();
  };

  const onClickStickerEvent = () => {
    startStickerEvent();
    toggleTeacherMenu();
  };

  const onClickToggleQuiz = () => {
    toggleQuiz();
    toggleTeacherMenu();
  };

  const onClickToggleStretCh = () => {
    toggleStretching();
    toggleTeacherMenu();
  };

  const onClickToggleConcentrationMenu = () => {
    toggleConcentrationMenu();
    toggleTeacherMenu();
  };

  return (
    <div css={TotalComponent}>
      {display && (
        <div style={{ backgroundColor: "white" }} className="openModal">
          <div className="buttonsContents">
            <IconButton
              color="inherit"
              className="navButton"
              id="navRandButton"
              onClick={onClickRandomPick}
              disabled={!randAvailable}
            >
              <div className="buttonStyle">
                {randAvailable ? (
                  <RandomIcon />
                ) : (
                  <RandomIcon
                    color="secondary"
                    style={{ animation: "cooldown 5s linear 1" }}
                  />
                )}
                <p>발표자 뽑기</p>
              </div>
            </IconButton>

            <IconButton
              color="inherit"
              className="navButton"
              id="navRandButton"
              onClick={onClickStickerEvent}
              disabled={!stickerAvailable}
            >
              <div className="buttonStyle">
                {stickerAvailable ? (
                  <GhostIcon />
                ) : (
                  <GhostIcon
                    color="secondary"
                    style={{ animation: "cooldown 30s linear 1" }}
                  />
                )}
                <p>집중!!</p>
              </div>
            </IconButton>
            <IconButton
              color="inherit"
              className="navButton"
              id="navRandButton"
              onClick={onClickToggleQuiz}
            >
              <div className="buttonStyle">
                <QuizIcon />
                <p>퀴즈 열기</p>
              </div>
            </IconButton>
            <IconButton
              color="inherit"
              className="navButton"
              id="navRandButton"
              onClick={onClickToggleStretCh}
              disabled={!stickerAvailable}
            >
              <div className="buttonStyle">
                {stickerAvailable ? (
                  <StretchingIcon />
                ) : (
                  <StretchingIcon
                    color="secondary"
                    style={{ animation: "cooldown 30s linear 1" }}
                  />
                )}
                <p>스트레칭</p>
              </div>
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

const TotalComponent = css`
  position: absolute;
  left: 70px;
  width: 250px;

  .openModal {
    z-index: 9999;
    background-color: rgb(62 76 118);
    border-radius: 20px;
    padding-left: 10px;
    animation: modal-bg-show 0.3s;

    .buttonContents {
      background-color: rgb(62 76 118);
      display: grid;
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-columns: 1fr;
    }
  }

  @keyframes modal-bg-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default TeachersToolbar;
