import { Col, FloatingLabel, Button, Form, Image } from "react-bootstrap";
import RoundCard from "../components/atoms/RoundCard";
import { useAppSelector } from "../store/hooks";
import { editName, selectUser } from "../store/user";
import { useState , useEffect} from "react";
import { updateUserProfile , deleteUser, getUserProfile } from "../api/user/userApi.tsx";
import {UserProfileUpdateDTO, UserResponseDTO} from "../api/user/types.tsx";
import { useDispatch } from "react-redux";

interface Edit {
  name: string;
  profileImage: string;
  email: string;

}
function Info() {
  const dispatch = useDispatch();
  const loginUser = useAppSelector(selectUser);
  console.log(loginUser);
  const [isEdit, setMode] = useState(false);
  const [data, setData] = useState<Edit>({
    name: loginUser.name || "",
    profileImage: loginUser.profileImage || "",
    email : loginUser.email || "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 정보 수정 함수
  const handleEdit = async () => {
    try {
      const userProfileUpdateDto : UserProfileUpdateDTO = {
        name : data.name,
        profileImage : data.profileImage,
        email : data.email,
      }
      await updateUserProfile<UserResponseDTO>(
        userProfileUpdateDto
      );
      
        dispatch(editName(userProfileUpdateDto.name));
      setMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser<void>();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await getUserProfile<UserResponseDTO>();
        const userProfile = response.data.data;
        setData({
          name: userProfile.name,
          profileImage: userProfile.profileImage,
          email : userProfile.email,
        });
        console.log(" useEffect, userProfile = ", userProfile);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUserData();
  }, []);

  return (
      <>
        <RoundCard width="900px" height="400px">
          {/* <p>
        CARD
          image | form + buttons
      </p> */}
          <Col className="d-flex flex-column  align-items-center  justify-content-center">
            <div>
              <Image
                  src={loginUser.profileImage}
                  style={{
                    // fluid,
                    // roundedCircle,
                    width:'300px',
                    height:'300px',
                    borderRadius:'150px'
                  }}

                  alt="profile picture"
              ></Image>
              {/* 사진 수정 */}
            </div>
          </Col>
          {/* align-items-center
            className="d-flex align-items-center justify-content-center"
            */}
          <Col className="position-relative py-2 px-4 d-flex flex-column align-items-center justify-content-center">
            <Form style={{ width: "100%" }}>
              <FloatingLabel label="이름">
                <Form.Control
                    name="name"
                    readOnly={!isEdit}
                    onChange={handleInputChange}
                    value={data.name}
                />
              </FloatingLabel>
                           
{/* 빈 줄 추가 */}
<div style={{ margin: "20px 0" }}></div>
<FloatingLabel label="이메일" >
                <Form.Control
                    name="email"
                    readOnly
                    disabled
                    onChange={handleInputChange}
                    value={data.email}
                />
              </FloatingLabel>
              

{/* 빈 줄 추가 */}
<div style={{ margin: "20px 0" }}></div>
<FloatingLabel label="meetingURL">
                <Form.Control
                    readOnly
                    disabled
                    type="text"
                    defaultValue={loginUser.meetingUrl}
                />
              </FloatingLabel>
              
              {/* 빈 줄 추가 */}
<div style={{ margin: "20px 0" }}></div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {isEdit ? (
                    <Button variant="outline-primary" onClick={handleEdit}>
                      확인
                    </Button>
                ) : (
                    <Button variant="outline-primary" onClick={() => setMode(true)}>
                      정보수정
                    </Button>
                )}
                <Button variant="danger" onClick={handleDelete}>회원탈퇴</Button> {/* 추가 */}
              </div>
              {/* <Form.Control type="button"readOnly defaultValue="" /> */}
            </Form>
            {/*
          <div className="mb-4">이름- 수정</div>
          <div className="mb-4">대화명- 수정</div>
          <div className="mb-4">소셜로그인이메일</div>
          개인미팅룸주소
          <div className="mb-4">회원탈퇴</div> */}
          </Col>
        </RoundCard>
      </>
  );
}

export default Info;
