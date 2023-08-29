import { Nav } from "react-bootstrap";
import { NavTab } from "./atoms/tab/NavTab";

interface Props {
  label: Array<string>;
  linkto: Array<string>;
  icons: Array<string>;
  disable?: boolean | false;
  style?: string;
  selectMenu: React.Dispatch<React.SetStateAction<string>>;
  selectedMenu: string;
} // 적용해서 수정해야 함
//지금 하려고 하는 것 dash에서 usestate로 현재 어느 탭에 있는지 표시
const SideNav: React.FC<Props> = (props: Props) => {
  //style={{color:'#8C8C8C'}}
  // sidebar & inner header
  const { label, linkto, selectMenu, icons } = props;
  const menu = linkto;
  // ["group", "calendar", "meeting", "item"];//props.linkto
  // ["그룹", "캘린더", " 회의", "뽑기"];//props.label

  const handleSelect = (menuname: string) => {
    selectMenu(menuname);
  };
  const navlinks = menu.map((eng, index) => (
    <NavTab
      label={label[index]}
      linkto={eng}
      linktype="NavLink"
      button={true}
      className="items-center"
      width="200px"
      height="60px"
      bround="20px"
      variant="outline-primary"
      icon={icons[index]}
      onClick={() => handleSelect(label[index])}
      selectedMenu={props.selectedMenu}
      key={index}
    ></NavTab>
  ));

  return (
    <>
      <div>
        <Nav className="flex-column pt-5">{navlinks}</Nav>
      </div>
    </>
  );
};

export default SideNav;
