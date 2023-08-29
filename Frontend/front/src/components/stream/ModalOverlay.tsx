import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface Props {
  buttonLabel?: string;
  title?: string;
  short?: boolean | false;
}
interface InputData {
  question: string;
  timelimit: string;
  answer?: string;
  options?: number;
}
const ModalOverlay = (props: Props) => {
  const [show, setShow] = useState(false);
  const [quizData, setQuizData] = useState<InputData>({
    question: "질문을 입력하세요",
    timelimit: "10초",
  });
  const handleSubmit = () =>{
    console.log(quizData);
    handleClose();
  } ;
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // if (name === "members") {
    //   const memberArray = value.split(",").map((member) => member.trim());
    //   setQuizData((prevData) => ({
    //     ...prevData,
    //     [name]: memberArray,
    //   }));
    // } else {
      setQuizData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    // }
  };
  //183/318
//   if else short-> 뽑기
//
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {props.buttonLabel}
      </Button>

      <Modal show={show} dialogClassName="modal-30w" onHide={handleClose} backdrop="static">
        <Modal.Header>
          <Modal.Title> {props.title}</Modal.Title>
          <div>
            <Button onClick={handleClose}>Close</Button>{" "}
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="meetinglink">
              <Form.Label>질문</Form.Label>
              <Form.Control
                size="lg"
                type="textarea"
                style={{ borderRadius: "20px",height:"30px" }}
                placeholder="질문을 입력하세요"
                name="meetingLink"
                onChange={handleInputChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group  className="mb-3" controlId="nickname">
              <Form.Label>제한시간</Form.Label>
              <Form.Control
                style={{ borderRadius: "20px" }}
                placeholder="제한 시간 설정"
                name="timelimit"
                value={quizData.timelimit}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* 대기창으로 가는법,,, onClick={()=><Navigate to={"/wait/:id"}></Navigate>} */}
          </Form>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};
export default ModalOverlay;

// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

// function MyVerticallyCenteredModal(props) {
//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Modal heading
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <h4>Centered Modal</h4>
//         <p>
//           Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
//           dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
//           consectetur ac, vestibulum at eros.
//         </p>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button onClick={props.onHide}>Close</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// function App() {
//   const [modalShow, setModalShow] = React.useState(false);

//   return (
//     <>
//       <Button variant="primary" onClick={() => setModalShow(true)}>
//         Launch vertically centered modal
//       </Button>

//       <MyVerticallyCenteredModal
//         show={modalShow}
//         onHide={() => setModalShow(false)}
//       />
//     </>
//   );
// }

// render(<App />);
