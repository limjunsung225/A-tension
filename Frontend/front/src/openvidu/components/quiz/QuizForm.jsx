import React, { Component } from 'react';
import './QuizForm.css';

class QuizForm extends Component {
  state = {
    type: true,
    question: 'none',
    A1: 'none',
    A2: 'none',
    A3: 'none',
    A4: 'none',
    answer: 'none',
    myAnswer: 'none',
    answerA1: 0,
    answerA2: 0,
    answerA3: 0,
    answerA4: 0,
  };

  submit = (event) => {
    event.preventDefault();
    this.props.quizCreate(this.state);
  };

  debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  printValue = (e) => this.changeState(e);

  changeState = (e) => {
    if (e.name === 'question') {
      this.setState({ question: e.value });
    } else if (e.name === 'a1') {
      this.setState({ A1: e.value });
    } else if (e.name === 'a2') {
      this.setState({ A2: e.value });
    } else if (e.name === 'a3') {
      this.setState({ A3: e.value });
    } else if (e.name === 'a4') {
      this.setState({ A4: e.value });
    } else if (e.name === 'answer') {
      this.setState({ answer: e.value });
    }
  };

  onChange = (e) => {
    this.printValue(e.target);
  };

  render() {
    return (
      <div className="quizFormContainer">
        <div className="form-style-7">
          <h1>4지선다 퀴즈</h1>
          <ul>
            <li>
              <label htmlFor="question">질문</label>
              <input
                onChange={this.onChange}
                type="text"
                name="question"
                maxLength="100"
              />
              <span>문제를 적어주세요</span>
            </li>
            <li>
              <label htmlFor="a1">보기1</label>
              <input
                onChange={this.onChange}
                type="text"
                name="a1"
                maxLength="100"
              />
              <span style={{ background: '#2569E1FF' }}>
                첫번째 보기를 적어주세요
              </span>
            </li>
            <li>
              <label htmlFor="a2">보기2</label>
              <input
                onChange={this.onChange}
                type="text"
                name="a2"
                maxLength="100"
              />
              <span style={{ background: '#f37c7c' }}>
                두번째 보기를 적어주세요
              </span>
            </li>
            <li>
              <label htmlFor="a3">보기3</label>
              <input
                onChange={this.onChange}
                type="text"
                name="a3"
                maxLength="100"
              />
              <span style={{ background: '#D28945' }}>
                세번째 보기를 적어주세요
              </span>
            </li>
            <li>
              <label htmlFor="a4">보기4</label>
              <input
                onChange={this.onChange}
                type="text"
                name="a4"
                maxLength="100"
              />
              <span style={{ background: '#2A69A6' }}>
                네번째 보기를 적어주세요
              </span>
            </li>
            <li>
              <label htmlFor="answer">정답 선택</label>
              <select
                onChange={this.onChange}
                type="text"
                name="answer"
                maxLength="100"
              >
                <option value="none">정답 없음</option>
                <option value={this.state.A1}>{this.state.A1}</option>
                <option value={this.state.A2}>{this.state.A2}</option>
                <option value={this.state.A3}>{this.state.A3}</option>
                <option value={this.state.A4}>{this.state.A4}</option>
              </select>
              <span style={{ background: '#7163BA' }}>
                정답을 선택해주세요.
              </span>
            </li>
            <li>
              <button type="submit" onClick={this.submit}>
                퀴즈 만들기
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default QuizForm;
