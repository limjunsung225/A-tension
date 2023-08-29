import React, { Component } from 'react';
import './QuizModal.css';
import QuizResult from './QuizResult';
import QuizComponent from './QuizComponent';
import QuizComponent2 from './QuizComponent2';

class QuizModalStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: this.props.display,
      quiz: this.props.quiz,
      answer: 'none',
    };
  }

  componentDidUpdate() {
    if (this.state.display !== this.props.display) {
      this.setState({ display: this.props.display, quiz: this.props.quiz });
    }
  }

  close = () => {
    this.props.toggleQuizStudent();
  };

  submit = (answer) => {
    this.props.toggleQuizStudent(answer);
    let answerText = '';
    if (this.props.quiz.type) {
      if (answer === 'a1') {
        answerText = this.props.quiz.A1;
      } else if (answer === 'a2') {
        answerText = this.props.quiz.A2;
      } else if (answer === 'a3') {
        answerText = this.props.quiz.A3;
      } else if (answer === 'a4') {
        answerText = this.props.quiz.A4;
      }
    } else {
      if (answer === 'a1') {
        answerText = 'O';
      } else if (answer === 'a2') {
        answerText = 'X';
      }
    }

    this.setState({ answer: answerText });
  };

  render() {
    return (
      <div
        className={this.state.display ? 'quizModal openQuizModal' : 'quizModal'}
      >
        {this.state.display ? (
          <section className="quizSection">
            <header>
              {this.props.header}
              <button className="close" onClick={this.close}>
                &times;
              </button>
            </header>
            {this.state.quiz.result ? (
              <QuizResult quiz={this.state.quiz} />
            ) : this.state.quiz.type ? (
              <QuizComponent submit={this.submit} quiz={this.state.quiz} />
            ) : (
              <QuizComponent2 submit={this.submit} quiz={this.state.quiz} />
            )}

            {this.state.quiz.result && this.state.answer !== 'none' ? (
              <p>내가 고른 답 : {this.state.answer}</p>
            ) : null}

            {this.state.quiz.result && this.state.quiz.answer !== 'none' ? (
              <p>정답 : {this.state.quiz.answer}</p>
            ) : null}
            <footer>
              <button className="close" onClick={this.close}>
                닫기
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    );
  }
}

export default QuizModalStudent;
