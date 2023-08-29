import { useState } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";

interface MeetingData {
  conferenceTitle: string;
  nickname: string;
}

function Create() {
  const [conferenceCreateData, setConferenceCreateData] = useState<MeetingData>(
    {
      conferenceTitle: "",
      nickname: "",
    }
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setConferenceCreateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (
      !conferenceCreateData.conferenceTitle ||
      !conferenceCreateData.nickname
    ) {
      setErrorMessage("회의 제목과 닉네임은 필수 입력값입니다.");
      return;
    }

    navigate("/dash/meeting/wait", {
      state: {
        conferenceCreateData: conferenceCreateData,
      },
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="mt-5">
        <Form.Group lg as={Row} className="mb-3" controlId="meetinglink">
          <Form.Label column sm={2}>
            회의 제목
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              size="lg"
              style={{ borderRadius: "20px" }}
              placeholder="회의 제목을 입력하세요"
              name="conferenceTitle"
              value={conferenceCreateData.conferenceTitle}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
        <Form.Group lg as={Row} className="mb-3" controlId="nickname">
          <Form.Label column sm={2}>
            닉네임
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              size="lg"
              style={{ borderRadius: "20px" }}
              placeholder="닉네임을 입력하세요"
              name="nickname"
              value={conferenceCreateData.nickname}
              onChange={handleInputChange}
            />
          </Col>
        </Form.Group>
        {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" size="lg" variant="primary">
            생성
          </Button>
          <div style={{ marginLeft: "10px" }} />
        </div>
      </Form>
    </>
  );
}

export default Create;
