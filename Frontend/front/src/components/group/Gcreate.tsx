import {
  Form,
  Button,
  FloatingLabel,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
// import axios from "axios";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { Team, groupCreateTest, loginload } from "../../store/group";
import { User } from "../../store/user";
import { searchUser } from "../../api/user/userApi.tsx";
import { UserSearchResponseDto } from "../../api/user/types.tsx";
import { UUID } from "crypto";
import {
  createTeam,
  deleteTeam,
  findMyTeam,
  updateTeam,
} from "../../api/team/teamApi.tsx";
import {
  createTeamRequestBody,
  teamUpdateRequestDto,
} from "../../api/team/types.tsx";

interface GroupCreateData {
  members: UserSearchResponseDto[];
  description: string;
  name: string;
  // profileimg?:string;
}
interface Props {
  teamProp?: Team;
}

function UserListComponent({
  userList,
  selectedUsers,
  onUserSelect, // 새로 추가된 prop
}: {
  userList: UserSearchResponseDto[];
  selectedUsers: UserSearchResponseDto[]; // 선택한 유저 목록 전달
  onUserSelect: (user: UserSearchResponseDto) => void; // 유저 선택 이벤트 핸들러 전달
}) {
  const handleItemClick = (user: UserSearchResponseDto) => {
    console.log(`${user.userId}`);
    onUserSelect(user); // 선택한 유저를 부모 컴포넌트로 전달
  };
  return (
    <div>
      {userList.length > 0 ? (
        <ul>
          {userList.map((user) => (
            <li
              key={user.userId}
              onClick={() => handleItemClick(user)}
              // onMouseOver={() => console.log(user.userId)}
              style={{ display: "flex", borderRadius: "5px" }}
            >
              <img
                src={user.profileImage}
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />
              {user.name}
              {/*<button style={{alignItems: 'center'}}>추가</button>*/}
            </li>
          ))}
        </ul>
      ) : (
        <p></p>
      )}
    </div>
  );
}
const Gcreate = (props: Props) => {
  const [mode, setMode] = useState("create");
  const [userList, setUserList] = useState<UserSearchResponseDto[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResponseDto[]>(
    []
  );

  const handleItemClick = (user: UserSearchResponseDto) => {
    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    setUserList([]); // userList 초기화
    console.log(selectedUsers);
  };
  const [groupData, setGroupData] = useState<GroupCreateData|Team>({
    name: props.teamProp ? props.teamProp.name : "",
    members: props.teamProp?.members ? props.teamProp.members : [""],
    description: props.teamProp?.description ? props.teamProp.description : "",
  });
  const dispatch = useAppDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "members") {
      const memberArray = value.split(",").map((member) => member.trim());
      const search = searchUser<UserSearchResponseDto[]>(value);
      search.then(function (result) {
        if (result.data.data !== undefined) {
          setUserList(result.data.data);
          console.log("search userList"+userList);
        }
      });
      setGroupData((prevData) => ({
        ...prevData,
        [name]: memberArray,
      }));
    } else {
      setGroupData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isError, setErrorMode] = useState();
  const handleCreate = async() => {
    if (props.teamProp) {
      console.log("edit");
    } else {
      const userIdList: UUID[] = [];
      for (const user of selectedUsers) {
        userIdList.push(user.userId);
      }
      const createTeamRequestBody: createTeamRequestBody = {
        name: groupData.name,
        userIdList: userIdList,
        description:groupData.description ?? "",
      };
      await createTeam(createTeamRequestBody);
      await findMyTeam().then((result)=>dispatch(loginload(result.data.data)))
      
      // findMyTeam()
      // TODO
      //  groupData 변경 필요
    }

    // console.log(groupData);
    // 생성시 그룹 조회 호출/ 특정그룹 정보 호출
    // e.preventDefault();
    // const formData = new FormDataEvent(e.target);
    // const dataObject = Object.fromEntries(formData);
    // Navigate('/dash/group',{state:{data:dataObject}});
    //axios api put?placeholder="그룹명을 입력하세요"placeholder="그룹원을 추가하세요"
  };
  const handledelete = async () => {
    setMode("delete");
    if (props.teamProp) {
      try {
        setIsLoading(true);

        await deleteTeam(props.teamProp.teamId).catch((error) => {
          // console.log(error);
          setErrorMode(error);
        });

        setIsLoading(false);

        await findMyTeam()
          .then((result) => dispatch(loginload(result.data.data)))
          .catch((error) => {
            // console.log(error);
            setErrorMode(error);
          });
        // await simulateLoading();
      } finally {
        setModalShow(true);
        //적절한 게 아니라면 없애도 문제 없음, 예외상황,
      }
    }
  };
  const handleEdit = async () => {
    // console.log("edit");
    setMode("edit");

    const teamUpdateRequestDto: teamUpdateRequestDto = {
      name: groupData.name,
      profileImage: groupData.description ?? "",
      description: groupData.description ?? "",
    };
    if (props.teamProp) {
      try {
        setIsLoading(true);
        await updateTeam(props.teamProp?.teamId, teamUpdateRequestDto).catch(
          (error) => {
            // console.log(error);
            setErrorMode(error);
          }
        );
        setIsLoading(false);
        await findMyTeam()
          .then((result) => dispatch(loginload(result.data.data)))
          .catch((error) => {
            // console.log(error);
            setErrorMode(error);
          });
        // await simulateLoading();
      } finally {
        setModalShow(true);
        //적절한 게 아니라면 없애도 문제 없음, 예외상황,
      }
    }
  };

  const ConfirmModal = () => {
    let variant = "light";
    if (isError) {
      variant = "warning";
    } else if (mode == "edit") {
      variant = "primary";
    } else if (mode == "create") {
      variant = "light";
    } else {
      variant = "danger";
    }

    return (
      <>
        <Alert
          key={variant}
          variant={variant}
          onClose={() => setModalShow(false)}
          dismissible
        >
          그룹을 {mode == "create" ? "생성" : mode == "edit" ? "수정" : "삭제"}
          {isError && "하지 못"}
          했습니다.
        </Alert>
      </>
    );
  };

  return (
    <>
      {/*<h1>이미지 업로드</h1>*/}
      <div style={{ marginTop: "20px" }}>
        {modalShow && <ConfirmModal />}

        <Form onSubmit={handleCreate}>
          <FloatingLabel label="그룹명" className="mb-3">
            <Form.Control
              name="name"
              type="text"
              style={{
                backgroundColor: "#ECF3FC",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              value={groupData.name}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel label="그룹원" className="mb-3">
            <Form.Control
              name="members"
              type="text"
              style={{
                backgroundColor: "#ECF3FC",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              value={groupData.members}
              onChange={handleInputChange}
            />
            <UserListComponent
              memberlist={props.teamProp?.members}
              userList={userList}
              selectedUsers={selectedUsers} // 선택한 유저 목록 전달
              onUserSelect={handleItemClick} // 유저 선택 이벤트 핸들러 전달
            />
            <div>
              <div>초대된 유저</div>
              {selectedUsers.length > 0 ? (
                // {userList.map((user) => (
                //         <li key={user.userId}
                <ul>
                  {selectedUsers.map((user) => (
                    <li
                      key={user.userId}
                      style={{ display: "flex", borderRadius: "5px" }}
                    >
                      <img src={user.profileImage} style={{ height: "30px" }} />
                      {user.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul></ul>
              )}
            </div>
          </FloatingLabel>
          <FloatingLabel label="그룹 설명" className="mb-3">
            <Form.Control
              name="description"
              as="textarea"
              style={{
                backgroundColor: "#ECF3FC",
                borderRadius: "10px",
                border: "none",
                resize: "none",
              }}
              value={groupData.description}
              onChange={handleInputChange}
              cols={10}
            />
          </FloatingLabel>
          {isLoading && <Spinner animation="border" variant="primary" />}
          {!isLoading && props.teamProp && (
            <div style={{ display: "flex", width: "100%" }}>
              {/* <div style={{display:"flex"}}> */}
              <Button
                onClick={handleEdit}
                style={{
                  borderRadius: "10px",
                  // width: "20%",
                  justifySelf: "flex-end",
                }}
                variant="outline-primary"
              >
                그룹 수정
              </Button>
              <Button
                onClick={handledelete}
                style={{
                  borderRadius: "10px",
                  // width: "20%",
                  justifySelf: "flex-end",
                }}
                variant="danger"
              >
                그룹 삭제
              </Button>
            </div>
          )}

          {!isLoading && !props.teamProp && (
            <div style={{ display: "flex", width: "100%" }}>
              <Button
                onClick={handleCreate}
                style={{
                  borderRadius: "10px",
                  width: "20%",
                  justifySelf: "flex-start",
                }}
                variant="outline-primary"
              >
                그룹 생성
              </Button>{" "}
            </div>
          )}

          {/* <Form.Control type="button"readOnly defaultValue="" /> */}
        </Form>
      </div>
    </>
  );
};
export default Gcreate;
