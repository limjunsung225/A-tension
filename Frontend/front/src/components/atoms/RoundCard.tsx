// .card {
//     width: 1000px;
//     height: 550px;
//     border-radius: 20px;
//   }
// import fillerImg from "../../assets/bwink_edu_04_single_04.jpg";
// 이 컴포넌트는 파란배경에 둥근모서리 사각형카드 정중앙 정렬
import { Card, Row } from "react-bootstrap";
interface Props {
  width?: string | "1000px";
  height?: string | "550px";
  children?: React.ReactNode;
  color?: string | "white";
}
const RoundCard: React.FC<Props> = (props: Props) => {
  const headerHeight = 53; // Change this value to match your actual header height
  const colHeight ="100vh";//`calc(100vh - ${headerHeight}px)`;//"100vh";
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: colHeight, background: "#ECF3FC" }}
      >
        <Card
          className="mx-auto "
          style={{ height: props.height, width: props.width, borderRadius: 20 }}
        >
          <Row style={{ height: props.height }}>{props.children}</Row>
        </Card>
      </div>
    </>
  );
};

export default RoundCard;
