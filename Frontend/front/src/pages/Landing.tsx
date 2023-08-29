import banner from "../assets/landingimagenobutton.png";
import concengroup from "../assets/concengroup.png";
import uigroup from "../assets/uigroup.png";
import groupgroup from "../assets/groupgroup.png";
import gamegroup from "../assets/gamegroup.png";
import footerimage from "../assets/footerimage.png";
import "bootstrap";
import "../App.css";

interface Props {
  featureRef: React.RefObject<HTMLImageElement>;
  introRef: React.RefObject<HTMLImageElement>;
}
function Landing(props: Props) {
  return (
    <>
      <div
        style={{ textAlign: "center", position: "relative", marginTop: "53px" }}
      >
        <img src={banner} alt="Banner" ref={props.introRef} />
        <div id="features" style={{ overflowY: "auto" }}>
          <img
            src={concengroup}
            alt="Concen Group"
            ref={props.featureRef}
            style={{ width: "85%", margin: "0 auto" }}
          />
          <img
            src={uigroup}
            alt="UI Group"
            style={{ width: "85%", margin: "0 auto" }}
          />
          <img
            src={groupgroup}
            alt="Group Group"
            style={{ width: "85%", margin: "0 auto" }}
          />
          <img
            src={gamegroup}
            alt="Game Group"
            style={{ width: "85%", margin: "0 auto" }}
          />
        </div>
        <img
          src={footerimage}
          alt="Footer"
          style={{
            width: "100%",
            height: "auto",
            minHeight: "400px",
            margin: "0 auto",
          }}
        />
      </div>
    </>
  );
}

export default Landing;
