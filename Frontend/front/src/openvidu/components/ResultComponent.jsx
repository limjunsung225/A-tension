import { css } from "@emotion/react";
import TeacherResult from "./result/TeacherResult";
import StudentResult from "./result/StudentResult";
import "./SetupComponent.css";

const Result = (props) => {
  const {
    teacherName,
    classTitle,
    whoami,
    myData,
    othersData,
    absentData,
    studentList,
    studentInfo,
    teacherData,
  } = props;

  // 결과창 나온 시간
  const time = new Date();
  const finTime =
    String(time.getHours()).padStart(2, "0") +
    ":" +
    String(time.getMinutes()).padStart(2, "0") +
    ":" +
    String(time.getSeconds()).padStart(2, "0");

  // // 장치 중지시키기
  // const stopDevices = async () => {
  //   const audios = await getAudios();
  //   const videos = await getVideos();
  //   console.log(audios);
  // };
  // stopDevices();

  return (
    <>
      <div>
        {whoami === "teacher" ? (
          <>
            <TeacherResult
              whoami={whoami}
              myData={myData}
              othersData={othersData}
              teacherName={teacherName}
              classTitle={classTitle}
              finTime={finTime}
              studentList={studentList}
              studentInfo={studentInfo}
              absentData={absentData}
            />
          </>
        ) : (
          <>
            <StudentResult
              whoami={whoami}
              myData={myData}
              othersData={othersData}
              teacherName={teacherName}
              classTitle={classTitle}
              finTime={finTime}
              studentList={studentList}
              studentInfo={studentInfo}
              teacherData={teacherData}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Result;
