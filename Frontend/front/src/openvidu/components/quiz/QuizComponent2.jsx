import React, { Component } from 'react';
import BoxContainer from './BoxContainer';
import SubmitButton from './SubmitButton';
import './QuizComponent.css';

class QuizComponent extends Component {
  state = {
    question: this.props.quiz.question,
    answer: this.props.quiz.answer,
    A1: 'O',
    A2: 'X',
    select: 'none',
  };

  select = (e) => {
    e.preventDefault();
    this.setState({ select: e.target.value });
  };

  result = (e) => {
    e.preventDefault();
    this.props.submit(this.state.select);
  };

  render() {
    return (
      <div className="quizContainer">
        <h1 className="question">문제: {this.state.question}</h1>
        <div className="flex-grid">
          <div className="grid-item">
            <BoxContainer
              id="a1"
              select={this.select}
              color="#2569e1"
              answer={this.state.A1}
              activate={this.state.select === 'a1' ? true : false}
            />
          </div>
          <div className="grid-item">
            <BoxContainer
              id="a2"
              select={this.select}
              color="#f37c7c"
              answer={this.state.A2}
              activate={this.state.select === 'a2' ? true : false}
            />
          </div>
        </div>
        <SubmitButton result={this.result} />
      </div>
    );
  }
}

export default QuizComponent;
