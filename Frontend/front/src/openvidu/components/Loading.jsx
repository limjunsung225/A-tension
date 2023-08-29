import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import LoadingImg from "../assets/images/loadingimg.gif";
import { useNavigate } from "react-router-dom";

const Loading = ({ whoami }) => {
  const [msg, setMsg] = useState("교실로 이동중입니다.");
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(`/${whoami}`);
    }, 8000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsg((prev) => prev + ".");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div css={LoadingContainer}>
      <img src={LoadingImg} className="loadingimg" />
      <h3>{msg}</h3>
    </div>
  );
};

const LoadingContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: white;
  width: 100vw;
  height: 100vh;
  z-index: 1000;

  .loadingimg {
    display: flex;
    width: 40vw;
    height: 40vh;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
  }
`;

export default Loading;
