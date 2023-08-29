import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import InterceptedAxios from "../../../utils/iAxios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TeacherResult = ({
  teacherName,
  classTitle,
  whoami,
  myData,
  othersData,
  absentData,
  finTime,
  studentList,
  studentInfo,
}) => {
  const [attStudentNum, setAttStudentNum] = useState(0);
  const [totalSticker, setTotalSticker] = useState(0);
  const [sortedOthersData, setSortedOthersData] = useState([]);

  const pointApplyToDB = async () => {
    try {
      const promises = othersData.map(async (elem) => {
        if (elem.isPointDouble)
          InterceptedAxios.patch(
            `/students/points/${elem.point * 2}?studentId=${elem.uid}`
          );
        else
          InterceptedAxios.patch(
            `/students/points/${elem.point}?studentId=${elem.uid}`
          );
      });
      await Promise.all(promises);
    } catch (e) {
      alert(
        "오류가 발생하여 정상적으로 저장되지 않았습니다. 행정실에 문의하세요."
      );
    }
  };

  const logApplyToDB = async () => {
    const logs = { classId: 1, logList: [] };
    // 출석자 로그
    for (const student of othersData) {
      if (student.isPointDouble)
        logs.logList.push({
          attendance: true,
          point: student.point * 2,
          presentCnt: student.presentationCnt,
          studentId: student.uid,
        });
      else
        logs.logList.push({
          attendance: true,
          point: student.point,
          presentCnt: student.presentationCnt,
          studentId: student.uid,
        });
    }

    // 결석자 로그
    for (const absent of absentData) {
      logs.logList.push({
        attendance: false,
        point: 0,
        presentCnt: 0,
        studentId: studentInfo[absent],
      });
    }
    await InterceptedAxios.post(`/records/log`, logs);
  };

  const onClickApply = async () => {
    pointApplyToDB();
    logApplyToDB();
  };

  useEffect(() => {
    setAttStudentNum(othersData.length); // 참여자 수
    setTotalSticker(othersData.reduce((acc, cur) => (acc += cur.point), 0)); // 총 부여 스티커 계산식
    setSortedOthersData(othersData.sort((a, b) => b.point - a.point));
  }, [whoami, myData, othersData, totalSticker]);

  // 스크롤 처리 해야함

  const data = [
    { name: "출석", value: attStudentNum },
    { name: "결석", value: studentList.length - attStudentNum },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    value,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + 18 * Math.cos(-midAngle * RADIAN);
    const y = cy + 28 * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        fontSize={14}
        fontWeight={700}
      >
        {`${name} : ${value}명`}
      </text>
    );
  };

  const COLORS = ["#759eff", "#ff9b89"];

  return (
    <div>
      <div className="">
        <div className="" />
      </div>
      <div className="">
        <div className="">
          <div className="">
            <div className="" />
            <div className="" />
            <div className="" />
          </div>
          <hr />
          <div className="">
            <div>
              <div css={ClassStatistic}>
                <h1 style={{ margin: "0" }}>수업 통계</h1>
                <div className="classContainer">
                  <div className="teacherResult">
                    <div className="teacher index">
                      <div className="t-classname">수업 이름</div>
                      <div className="t-nickname">선생님 이름</div>
                      <div className="t-attendance-time">수업 개설 시간</div>
                      <div className="t-fin-time">수업 종료 시간</div>
                      <div className="t-point">총 부여 상점</div>
                    </div>
                    <div className="teacher">
                      <div className="t-classname">{classTitle}</div>
                      <div className="t-nickname">{teacherName}</div>
                      <div className="t-attendance-time">
                        {myData.attendanceTime}
                      </div>
                      <div className="t-fin-time">{finTime}</div>
                      <div className="t-point">{totalSticker}</div>
                    </div>
                  </div>
                  <div
                    className="teacherResultChart"
                    style={{
                      paddingLeft: "50px",
                    }}
                  >
                    <ResponsiveContainer width={250} height={200}>
                      <PieChart>
                        <Pie
                          label={renderCustomizedLabel}
                          data={data}
                          cx="50%"
                          cy="50%"
                          fill="#8884d8"
                          labelLine={false}
                          innerRadius={10}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div css={TotalResult}>
                {/* <h3 style={{ margin: '0' }}>학생 통계</h3> */}
                <div className="studentContainer">
                  <div className="studentResult">
                    <div className="person index">
                      <div className="s-nickname">닉네임</div>
                      <div className="s-attendance-time">최종 출석 시간</div>
                      <div className="s-point">상점</div>
                      <div className="s-point">발표횟수</div>
                    </div>
                    <div className="student-result-data">
                      {sortedOthersData.map((other, i) => (
                        <div key={i} className="person">
                          <div className="s-nickname">{other.nickname}</div>
                          <div className="s-attendance-time">
                            {other.attendanceTime}
                          </div>
                          <div className="s-point">
                            {other.isPointDouble ? (
                              <p style={{ color: "red" }}>
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "black",
                                  }}
                                >
                                  {other.point}
                                </span>
                                =&gt;{other.point * 2}
                              </p>
                            ) : (
                              <p>{other.point}</p>
                            )}
                          </div>
                          <div className="s-present">
                            {other.presentationCnt}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <ResponsiveContainer width={450} height={270}>
                      <BarChart
                        data={sortedOthersData}
                        margin={{
                          top: 24,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nickname" style={{ fontSize: "9pt" }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="point" stackId="a" fill="#a589cd" />
                        <Bar
                          dataKey="presentationCnt"
                          stackId="a"
                          fill="#f3ca7e"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div css={OtherThings}>
                <a href="/teacher">
                  <button onClick={onClickApply}>저장 후 돌아가기</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackgroundContainer = css`
  background-color: #ffffff;
  opacity: 0.8;
  background-image: linear-gradient(#929292 1px, transparent 1px),
    linear-gradient(to right, #929292 1px, #ffffff 1px);
  background-size: 30px 30px;
  height: 100vh;
  position: relative;

  button {
    width: 200px;
    height: 45px;
    border-radius: 20px;
    background: var(--pink);
    border: none;
    font-family: "NanumSquareRound";
    font-size: 13pt;
    color: white;
    font-weight: 700;
    text-decoration-line: none;
  }

  button:hover {
    cursor: pointer;
  }

  .triangles {
    position: absolute;
    width: 100%;
    height: 100%;

    div {
      width: 0px;
      height: 0px;
    }

    .triangle1 {
      border-bottom: 40vh solid #bdcde5;
      border-left: 0px solid transparent;
      border-right: 100vw solid transparent;
      transform: scaleY(-1);
    }

    .triangle2 {
      position: absolute;
      top: 60%;
      border-bottom: 40vh solid #f8cbd3;
      border-left: 100vw solid transparent;
      border-right: 0px solid transparent;
    }
  }

  .child {
    position: absolute;
    width: 79.8vw;
    height: 83vh;
    left: 0.5vw;
    top: -0.5vh;

    border-radius: 20px;

    background-color: white;

    border: 2px solid #000000;
  }

  .parent {
    position: relative;
    width: 80vw;
    height: 84vh;
    left: 9.8vw;
    top: 8vh;

    border-radius: 20px;

    background-color: #fff1bf;

    border: 2px solid #001111;
  }

  .sideContainer {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 78vh;
    vertical-align: center;
  }

  hr {
    width: 100%;
    height: 1.5px;
    border: 0;
    background-color: black;
  }

  .index {
    background-color: #d5dfee;
  }

  .circles {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: end;
    margin: 10px 10px 0 10px;
    div {
      border: 2px solid black;
      width: 10px;
      height: 10px;
      border-radius: 75px;
      background-color: #000000;
      float: left;
    }

    .circle1 {
      background-color: #96ba85;
    }

    .circle2 {
      background-color: #ffe381;
      margin-left: 0.3rem;
    }

    .circle3 {
      background-color: #ef8181;
      margin-left: 0.3rem;
      margin-right: 1rem;
    }
  }
`;

const TotalContainer = css`
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ClassStatistic = css`
  width: 70%;
  height: 44%;
  border-radius: 20px;
  margin-top: 10px;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .classContainer {
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
  .teacherResult {
    display: flex;
    flex-direction: row;
    background: #f5f5f5;
    margin-right: 20px;
    border-radius: 5px;
    border: 2px solid gray;
  }

  h3 {
    text-align: center;
  }

  .teacher {
    display: flex;
    flex-direction: column;

    & > div {
      display: flex;
      margin: 0.7rem;
      height: 0.5rem;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    & > .t-classname {
      display: flex;
      width: 200px;
      justify-content: center;
      align-items: center;
    }

    & > .t-nickname {
      display: flex;
      width: 200px;
      justify-content: center;
      align-items: center;
    }

    & > .t-attendance-time,
    .t-fin-time {
      display: flex;
      width: 200px;
      justify-content: center;
      align-items: center;
    }

    & > .t-point,
    .t-student-number,
    .t-att-student-number {
      display: flex;
      width: 200px;
      justify-content: center;
      align-items: center;
    }
  }

  .index {
    font-weight: 700;
    border-right: 2px solid gray;
  }
`;

const TotalResult = css`
  width: 70%;
  height: 45%;
  border-radius: 20px;
  margin-top: 10px;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .studentContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .studentResult {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 80%;
    background: #f3f3f3;
    margin-right: 20px;
    border-radius: 5px;
    border: 2px solid gray;
    .index {
      border-bottom: 3px solid gray;
    }

    .person {
      border-bottom: 2px solid gray;
    }

    .student-result-data {
      overflow-y: auto;
    }

    .student-result-data::-webkit-scrollbar {
      display: block;
    }

    .student-result-data::-webkit-scrollbar-thumb {
      background-color: lightgrey;
      border-radius: 15px;
    }
    .student-result-data::-webkit-scrollbar-track {
      border-radius: 15px;
    }
  }

  h3 {
    text-align: center;
  }

  .teacher.index {
    background-color: #cad7ea;
    border-right: 3px solid gray;
  }

  .mydata {
    background-color: rgb(255, 155, 137);
    font-weight: 700;
    color: white;
  }

  .person {
    display: flex;
    flex-direction: row;
    border-bottom: 2px solid gray;

    & > div {
      display: flex;
      margin: 0.7rem;
      height: 0.5rem;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    & > .s-nickname {
      display: flex;
      width: 150px;
      justify-content: center;
      align-items: center;
    }

    & > .s-attendance-time {
      display: flex;
      width: 140px;
      justify-content: center;
      align-items: center;
    }

    & > .s-point {
      display: flex;
      width: 80px;
      justify-content: center;
      align-items: center;
    }

    & > .s-present {
      display: flex;
      width: 85px;
      justify-content: center;
      align-items: center;
    }
  }

  .index {
    font-weight: 700;
  }
`;

const OtherThings = css`
  button:hover {
    cursor: pointer;
  }
`;

export default TeacherResult;
