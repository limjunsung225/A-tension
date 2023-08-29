import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Nav,
    NavDropdown,
    Dropdown,
    Image,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { User, selectUser, userLogout } from "../store/user";
import { useEffect, useState } from "react";

const Logoutheader = () => {
  const User = useAppSelector(selectUser);
  const[loginData,setData]=useState(User);
  useEffect(() => {
    if(User){
      setData(User);
    }
    
  
    return () => {
    }
  }, [User])
  
  // const user = {
  //   name: "Ssafy",
  // };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  // console.log()
  const handleLogout = () => {
    console.log("logout button clicked");
    dispatch(userLogout());
    navigate("/");
  };
  const handleMyPage = () => {
    console.log("mypage click")
    navigate("/info");
  };
  
  const dropStyle: React.CSSProperties = {
    right: 0,
    // left: "auto", // Commented out since it's not being used
    marginTop: "var(--bs-dropdown-spacer)", // Make sure to provide the actual value here
    color: "white",
  };


    return (
        <>

      <Nav.Link
        as={Link}
        to="/dash"
        // state={{ prevPath: pathname }}
        className="text-white"
      >
        대시보드
      </Nav.Link>

      <Nav.Link
        as={Link}
        to="/dash/meeting/start"
        state={{ tab: "미팅" , to: "start"}}
        style={{ color: "white" }}
      >
        회의 개설
      </Nav.Link>
      <Nav.Link
        as={Link}
        to="/dash/meeting/join"
        state={{ tab: "미팅" ,to:"join"}}
        className="text-white"
      >
        회의 참여
      </Nav.Link>
      <NavDropdown
        as={Dropdown}
        content="none"
        title={
          <div className="flex items-center  text-white gap-2">
            <Image src={loginData.profileImage} style={{width:'40px', height:'40px', borderRadius:'30px'}} />
            {loginData.name}
          </div>
        }
        style={{ borderRadius: "20px" }}
      >

        <NavDropdown.ItemText as={Nav.Link} to="/info">
          {/* <Nav.Link as={Link} to="/info"> */}
            <div className="dropdown-content flex flex-col items-center text-center" onClick={handleMyPage}>
              <Image src={loginData.profileImage} roundedCircle style={{ width:"40px" }}/>
              <b>{loginData.name}</b>
              {loginData.email}
            </div>
          {/* </Nav.Link> */}
        </NavDropdown.ItemText>
        <NavDropdown.Divider></NavDropdown.Divider>
        <NavDropdown.Item
          onClick={handleLogout}
          className="flex flex-col text-center"
        >
          로그아웃
        </NavDropdown.Item>
      </NavDropdown>
     </>
  );

};
export default Logoutheader;
