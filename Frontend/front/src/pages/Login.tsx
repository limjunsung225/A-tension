import { Col, Row, Image } from "react-bootstrap";
import loginG from "../assets/btn_google_signin_light_normal_web@2x.png";
import loginN from "../assets/btnW_완성형.png";
import loginK from "../assets/kakao_login_medium_narrow.png";
import fillerImg from "../assets/welcome.png";
import RoundCard from "../components/atoms/RoundCard";
import { useAppDispatch } from "../store/hooks";
import { User, getUserGroups, userLogin } from "../store/user";
import { loginload } from "../store/group";
import { store } from "../store/store";

function Login() {
  // const headerHeight = 78; // Change this value to match your actual header height
  // const colHeight = `calc(100vh - ${headerHeight}px)`;
  // const trytologin: User = {
  //   name: "네이버",
  //   email: "ssafy@naver.com",
  //   userId: "",
  // };
  const dispatch = useAppDispatch();
  
  const handleTest = () => {
    //api 요청으로
    //auth?
    // sessionStorage.setItem("loginUser",JSON.stringify(trytologin));

    // dispatch(userLogin(trytologin));//axios에서 처리
    // const usergroups = getUserGroups(store.getState());
    // dispatch(loginload(usergroups))
    
  };
  return (
    <>
      <RoundCard height="300px" width="600px">
        <Row style={{ height: "300px" }}>
          <Col className="d-flex flex-column  align-items-center  justify-content-center">
            <div>
              <Image
                src={fillerImg}
                fluid
                rounded
                width={200}
                alt="Image by vectorjuice on Freepik"
              ></Image>
            </div>
          </Col>
{/* onClick={handleTest} */}
          <Col className="position-relative py-2 px-4 d-flex flex-column align-items-center justify-content-center">
            <a className="mb-4" href={import.meta.env.VITE_NAVER_AUTH_URL} >
              <img src={loginN} alt="naver login " width={183}/>
            </a>
            <a className="mb-4" href={import.meta.env.VITE_KAKAO_AUTH_URL}>
              <img src={loginK} alt="kakao login" />
            </a>
            <a className="mb-4" href={import.meta.env.VITE_GOOGLE_AUTH_URL}>
              <img src={loginG} alt="google login" width={184}/>
            </a>
          </Col>
        </Row>
      </RoundCard>
    </>
  );
}

export default Login;
