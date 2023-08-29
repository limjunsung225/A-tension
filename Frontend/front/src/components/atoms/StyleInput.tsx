import {  Form } from "react-bootstrap";

export const StyleInput = () => {
  return (
    <>
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></div>
    </>
  );
};
export default StyleInput;
