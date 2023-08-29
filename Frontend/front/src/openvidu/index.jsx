
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

// HTML파일에서 root를 찾아서 그 곳에 VideoRoomComponent를 삽입
ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// // HTML파일에서 root를 찾아서 그 곳에 VideoRoomComponent를 삽입
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
