import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab, Nav, Row, Col, Button, Form } from "react-bootstrap";
import Plans from "./group/Plans.tsx";
import Members from "./group/Members.tsx";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { Team, addDetail, getGrouplist } from "../store/group.ts";
import { checkAuthority } from "../store/user.ts";
import ManageGroup from "./group/ManageGroup.tsx";
import Gcreate from "./group/Gcreate.tsx";
import { getTeamDetail } from "../api/team/teamApi.tsx";
import { teamDetailResponseDto } from "../api/team/types.tsx";


function Group() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    //어디서 그룹을 다시 전달받는지?
    const groups: Team[] = useAppSelector(getGrouplist);
    // console.log(groups)

    const [selectedGroup, selectGroup] = useState<Team>();
    console.log(selectedGroup + " first usestate");
    if (!selectedGroup) {
        console.log("deselected");
    }
    const [isCreate, setMenu] = useState(false); //그룹생성창 여부
    const [selectedTab, setSelectedTab] = useState("info"); // 기본값은 "chat"으로 설정
    const [hasAuth, getAuth] = useState<boolean>(false); //그룹짱의 권한 체크,,//teamParticipantAuthorityDto 에 해당하나?
    // const curUserId = useAppSelector(getUserId);
    // const teamAuth:teamParticipantAuthorityDto = {teamId:BigInt(selectedGroup.id) ,userAuthDtoList:[{userId:curUserId, hasAuthority:true}]};

    const TF = useAppSelector(checkAuthority);

    const handleGroupSelect = (group: Team) => {
        selectGroup(group);
        console.log(selectedGroup?.name + "handle group select");
        //dispatch(hasAuthority());

        if (TF) getAuth(TF); // 실제로는 team participant has auth?
        else getAuth(false);
        console.log("selected" + group.name);

    };

    const grouplist = groups.map((group, index) => (
        <Nav.Link
            eventKey={index}
            onClick={() => {
                handleGroupSelect(group);
            }}
            key={index}
        >
            {group.name}
        </Nav.Link>
    ));
    const handleTabClick = (tab: string) => {
        if (groups.length > 0) {
            setSelectedTab(tab);
        }
    };
    const menuIndex = ["chat", "plans", "members", "manage"];
    // const groupMenu = ["채팅", "일정", "구성원", "관리"];
    const groupMenu = ["", "일정", "구성원", "관리"];

    const menuList = groupMenu.map((menu, index) => (
        <Nav.Item
            onClick={() => {
                if (index == 3 && !hasAuth) return;
                else handleTabClick(menuIndex[index]);
            }}
            key={index}
        >
            <Nav.Link
                style={{
                    color: selectedTab == menuIndex[index] ? "#176DEE" : "#B9BEC6",
                }}
                active={selectedTab == menuIndex[index]}
                disabled={
                    (index == 3 && !hasAuth) ||
                    groups.length == 0 ||
                    selectedGroup === undefined
                }
                eventKey={menuIndex[index]}
            >
                {menu}
            </Nav.Link>
        </Nav.Item>
    ));

    useEffect(() => {
        const escapeCreate = () => {
            // if (isCreate)
            setMenu(false);
        };
        setSelectedTab("plans");
        console.log(selectedGroup + " trying to close create view");
        escapeCreate();
    }, [selectedGroup]);
    useEffect(() => {
        const loadGroupDetail = () => {

            if (selectedGroup) {
                getTeamDetail<teamDetailResponseDto>(selectedGroup.teamId).then(
                    (result) => {
                        console.log(
                            "got detail" + result.data.data.name + result.data.data.teamId
                        );
                        const detailedGroup: teamDetailResponseDto = result.data.data;
                        // selectGroup(detailedGroup);
                        dispatch(addDetail(detailedGroup));
                    }
                );
                console.log("use effect detail call by selected group dependency");
            }
        };
        loadGroupDetail();
    }, [selectedGroup, dispatch]);

    return (
        <>
            <div>
                <Tab.Container defaultActiveKey="first">
                    <Row style={{marginTop:"60px"}}>
                        <Col sm={3} style={{ height: "450px" }}>
                            <div
                                style={{
                                    flex: "none",
                                    height: "300px",
                                    overflowY: "auto",
                                }}
                            >
                                <Nav variant="pills" className="flex-column">
                                    {grouplist}
                                </Nav>
                            </div>
                            <Nav.Item>
                                <Button
                                    style={{
                                        borderRadius: "10px",
                                        width: "100%",
                                        marginTop: "15px",
                                    }}
                                    onClick={() => setMenu(true)}
                                >
                                    그룹 추가
                                </Button>
                            </Nav.Item>
                        </Col>

                        {isCreate && (
                            <Col>
                                <Gcreate></Gcreate>{" "}
                            </Col>
                        )}
                        {!isCreate && (
                            <Col>
                                <Nav
                                    variant="underline"
                                    className="pb-0"
                                    // defaultActiveKey={selectedTab}
                                    activeKey={selectedTab}
                                >
                                    {menuList}

                                    <Nav className="ms-auto">
                                        <Nav.Item as={Nav.Link} linkto="">
                                            <Button
                                                onClick={() =>
                                                    navigate("/dash/meeting/join", {
                                                        state: {
                                                            group: selectedGroup,
                                                            toMeeting: "fromGroup",
                                                        },
                                                    })
                                                }
                                                style={{marginRight:"9px"}}
                                            >
                                                회의 참여
                                            </Button>
                                        </Nav.Item>
                                    </Nav>
                                </Nav>

                                <hr className="solid" />
                                {selectedTab === "info" && (
                                    <div>
                                        {/* 그룹 정보 컴포넌트를 렌더링 */}
                                        <h1>Group {selectedGroup?.name}</h1>
                                    </div>
                                )}
                                {/*{selectedTab === "chat" && (*/}
                                {/*  <div>*/}
                                {/*    /!* 채팅 컴포넌트를 렌더링 *!/*/}
                                {/*    <h1>{selectedGroup?.name} 그룹입니다</h1>*/}
                                {/*  </div>*/}
                                {/*)}*/}
                                {selectedTab === "plans" && (
                                    <div>
                                        <Plans teamProp={selectedGroup} />
                                    </div>
                                )}
                                {selectedTab === "members" && (
                                    <div>
                                        {/* 멤버 컴포넌트를 렌더링 */}
                                        <Members teamProp={selectedGroup} />
                                    </div>
                                )}
                                {selectedTab === "manage" && (
                                    <div>
                                        <ManageGroup teamProp={selectedGroup} />
                                    </div>
                                )}
                                {selectedTab === "chat" && (
                                    <div style={{ marginTop: "20px" }}>
                                        {/* 채팅상자를 렌더링 */}
                                        <Form
                                            style={{
                                                backgroundColor: "white",
                                                borderRadius: "10px",
                                                padding: "10px",
                                            }}
                                        >
                                            <Form.Group
                                                controlId="exampleForm.ControlTextarea1"
                                                style={{ marginBottom: "0" }}
                                            >
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="메시지 입력..."
                                                    style={{
                                                        backgroundColor: "#f7f7f7",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        resize: "none",
                                                    }}
                                                />
                                            </Form.Group>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                <Button variant="primary" type="submit">
                                                    전송
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                )}
                                {/* </Card> */}
                            </Col>
                        )}
                    </Row>
                </Tab.Container>
            </div>
        </>
    );
}

export default Group;
