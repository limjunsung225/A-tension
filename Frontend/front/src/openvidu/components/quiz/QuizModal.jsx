import React, { Component } from "react";
import "./QuizModal.css";
import QuizForm from "./QuizForm";
import QuizForm2 from "./QuizForm2";
import QuizListCard from "./QuizListCard";
import QuizResult from "./QuizResult";

class QuizModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: this.props.display,
      content: "two",
      quiz: this.props.quiz,
      idx: 0,
    };
  }

  componentDidUpdate() {
    if (this.state.display !== this.props.display) {
      this.setState({ display: this.props.display });
    }
    if (this.state.quiz !== this.props.quiz) {
      this.setState({ quiz: this.props.quiz });
    }
  }

  close = () => {
    this.props.toggleQuiz();
  };

  sendResult = () => {
    const quizResult = { ...this.props.quiz, result: true };
    this.props.toggleQuiz(quizResult);
    this.setState({ quiz: quizResult });
  };

  quizCreate = (quiz) => {
    this.props.toggleQuiz(quiz);
    this.setState({ content: "results" });
  };

  contentChange = (e) => {
    this.setState({ content: e });
  };

  loadHistory = (index, e) => {
    this.setState({ idx: index, content: e });
  };

  render() {
    return (
      <div
        className={this.state.display ? "quizModal openQuizModal" : "quizModal"}
      >
        {this.state.display ? (
          <section className="quizSection">
            <header>
              {this.props.header}
              <button onClick={this.close}>&times;</button>
            </header>
            <div className="quizMain">
              {
                {
                  two: <QuizForm2 quizCreate={this.quizCreate} />,
                  four: <QuizForm quizCreate={this.quizCreate} />,
                  list: this.props.quizHistory.map((q, index) => {
                    return (
                      <QuizListCard
                        key={index}
                        historyKey={index}
                        quiz={q}
                        loadHistory={this.loadHistory}
                      />
                    );
                  }),
                  results: <QuizResult quiz={this.state.quiz} />,
                  history: (
                    <QuizResult quiz={this.props.quizHistory[this.state.idx]} />
                  ),
                }[this.state.content]
              }
            </div>
            <footer>
              <button
                onClick={() => this.contentChange("two")}
                className="current"
              >
                OX 퀴즈
              </button>
              <button
                className="current"
                onClick={() => this.contentChange("four")}
              >
                4지선다 퀴즈
              </button>
              <button onClick={() => this.contentChange("list")}>
                퀴즈 목록
              </button>
              <button onClick={this.sendResult}>퀴즈결과 보여주기</button>
              <button className="sendResult" onClick={this.close}>
                닫기
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    );
  }
}

export default QuizModal;
