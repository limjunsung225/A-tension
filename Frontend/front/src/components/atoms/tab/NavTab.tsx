import { Nav } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import SidebarButton from "../button/SidebarButton";
import { Team } from "../../../store/group";

interface Props {
  linkto: string;
  label: string;
  linktype?: "NavLink" | "Nav";
  button?: boolean;
  height?: string;
  width?: string;
  bround?: string;
  disabled?: boolean;
  variant?: string;
  className?: string;
  onClick?: () => void;
  navProps?: Team;
  children?: React.ReactNode;
  icon?: string;
  key?: string|number;
  // hasAuth?: boolean|false;
  style?: React.CSSProperties;
  selectedMenu?: string;
}
//button을 props로 받았다면
//{props.Button && }
export const NavTab = (props: Props) => {
  // const isLoggedIn
  if (!props.button) {
    return (
      <>
        <Nav.Item>
          <Nav.Link
            eventKey={props.key}
            as={props.linktype == "Nav" ? Link : NavLink}
            to={props.linkto}
            onClick={props.onClick}
            state={props.navProps}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize:"20px",
              ...props.style
            }}
          >
            {props.label}
          </Nav.Link>
        </Nav.Item>
      </>
    );
  } else if (props.children) {// 내부에 버튼을 별개로 만들 
    if (props.button) {
      return (
        <>
          <Nav.Link
            eventKey={props.key}
            as={props.linktype == "Nav" ? Link : NavLink}
            to={props.linkto}
            onClick={props.onClick}
            state={props.navProps}
          >
            {props.children}
            {/* <Button
            className={props.className}
            style={{
              width: props.width,
              height: props.height,
              borderRadius: props.bround,
            }}
            variant={props.variant}
            aria-selected
          >
            {props.children}
          </Button> */}
          </Nav.Link>
        </>
      );
    }
  } else {
    // button 유무, CSS 완전 동일하게 할지 옵션 두개
    //icon있는 버튼
    return (
      <>
        <Nav.Link
          as={props.linktype == "Nav" ? Link : NavLink}
          to={props.linkto}
          onClick={props.onClick}
          // eventKey={props.key}
        >
          <SidebarButton
            selected={props.selectedMenu == props.label}
            icon={props.icon}
            // elabel={props.linkto}
            // elabel={props.linkto}
            klabel={props.label}
          ></SidebarButton>
        </Nav.Link>
      </>
    );
  }
};
