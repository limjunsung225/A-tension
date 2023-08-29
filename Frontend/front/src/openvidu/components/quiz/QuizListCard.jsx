import React, { Component } from 'react';
import './QuizListCard.css';
import QuizResult from './QuizResult';

class QuizListCard extends Component {
  state = {
    quiz: this.props.quiz,
  };

  componentDidUpdate() {
    if (this.state.quiz !== this.props.quiz) {
      this.setState({ quiz: this.props.quiz });
    }
  }

  render() {
    return (
      <div className="outSideContainer">
        <div className="outSideContainer">
          {this.props.quiz.type === undefined ? (
            <h1>퀴즈를 출제해 주세요</h1>
          ) : (
            <div className="outListContainer">
              <div className="quizListContainer">
                <h1>{this.props.quiz.question}</h1>
                <button
                  onClick={() =>
                    this.props.loadHistory(this.props.historyKey, 'history')
                  }
                >
                  결과 보기
                </button>
              </div>
              {!this.props.quiz.type ? (
                <div className="listItems">
                  <p style={{ color: '#2569e1' }}>O</p>
                  <p style={{ color: '#f37c7c' }}>X</p>
                </div>
              ) : (
                <div className="listItems">
                  <p style={{ color: '#f37c7c' }}>{this.props.quiz.A1}</p>
                  <p style={{ color: '#c47bd5' }}>{this.props.quiz.A2}</p>
                  <p style={{ color: '#2569e1' }}>{this.props.quiz.A3}</p>
                  <p style={{ color: '#c0efaf' }}>{this.props.quiz.A4}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default QuizListCard;
