// Overlay use className props to pass style properties to child component.
// To make this component work add className props to your child component manually.
// Here an example: https://gist.github.com/Miniplop/8f87608f8100e758fa5a4eb46f9d151f

// import iconGroup from '../../../assets/icons/icon_group.svg'
import styles from "./SidebarButton.module.scss";
import { Button } from "react-bootstrap";
//    width: 29.41%;
interface Props {
  elabel?: string; //사이드바 버튼 디자인 영문
  klabel: string; // 버튼 라벨 한글
  icon?: string; // 아이콘 여부
  notButton?: boolean | false; // 버튼이 아닌 경우 -> 아이콘+라벨
  selected?: boolean | false; //선택시 active 버튼 변경 위해
  show?: boolean | true; // 회의 진입시 우측 메뉴 표시 X
}

const SidebarButton = (props: Props) => {
  if (props.notButton) {
    return (
      <>
        {/* 아이콘 + 라벨 대시보드 우측 메뉴 표시 */}
        {props.show && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginLeft: "20px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <div className={styles.iconBlock}>
              <img
                // style={{transform:"scale(2)"}}
                alt={props.klabel}
                className={styles.sidebarButtonIcon}
                src={props.icon}
              />
            </div>
            <h4 className={styles.klabel} style={{ fontSize: "26px" }}>
              {props.klabel}
            </h4>
            {props.elabel && <p className={styles.elabel}>{props.elabel}</p>}
          </div>
        )}
      </>
    );
  } else {
    return (
      <Button
        active={props.selected}
        variant="outline-primary"
        style={{
          width: "100%",
          height: "53px",
          accentColor: "#006BE5",
          borderRadius: "13px",
        }}
      >
        <div className={styles.dot}>
          <div className={styles.iconBlock}>
            {/* <svg
            width={"22px"}
            height={"22px"}
            viewBox="0 0 22 22"
              className={styles.sidebarButtonIcon}
              fill={props.selected ? "white" : "gray"}
            >
              <use xlinkHref={props.icon}></use>
            </svg> */}
            <img
              alt={props.klabel}
              className={styles.sidebarButtonIcon}
              src={props.icon}
              style={{ fill: props.selected ? "white" : "gray" }}
            />
          </div>
          <p
            className={styles.klabel}
            style={{ color: props.selected ? "white" : "gray" }}
          >
            {props.klabel}
          </p>
          {props.elabel && (
            <p
              className={styles.elabel}
              style={{ color: props.selected ? "white" : "gray" }}
            >
              {props.elabel}
            </p>
          )}
        </div>
      </Button>
    );
  }
};

export default SidebarButton;
