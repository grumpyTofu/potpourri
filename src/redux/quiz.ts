import { Middleware } from "redux";

type Question = {
    category: string,
    correct_answer: string,
    difficulty: string,
    incorrect_answers: Array<string>,
    question: string,
    type: string,
    user_answer: string
  }

interface QuizState {
  questions: Array<Question>,
  current_question: number
};

const SET_QUESTIONS = 'SET_QUESTIONS';
const SET_CURRENT_QUESTION = 'SET_CURRENT_QUESTION';
const ANSWER_QUESTION = 'ANSWER_QUESTION';

export const quizActionCreators = {
  setQuestions: (content: Array<Question>) => ({
    type: SET_QUESTIONS,
    payload: {
      questions: content
    }
  }),
  setCurrentQuestion: (content: number) => ({
    type: SET_CURRENT_QUESTION,
    payload: {
      current_question: content
    }
  }),
  answerQuestion: (content: string) => ({ type: ANSWER_QUESTION, payload: {
    answer: content
  }})
};

const initialState: QuizState = {
  questions: [],
  current_question: 0
};

export const reducers = function(
  state = initialState, 
  action: any
) {
  switch (action.type) {
    case SET_QUESTIONS: {
      const { questions } = action.payload;
      return {
        ...state,
        questions: questions
      };
    }
    case SET_CURRENT_QUESTION: {
      const { current_question } = action.payload;
      return {
        ...state,
        current_question: current_question
      }
    }
    default:
      return state;
  }
}

export const middleware: Middleware = api => next => action => {
  // Do stuff
  if (action.type === ANSWER_QUESTION) {
    const { answer } = action.payload;
    const state = api.getState();
    var newQuestions = state.questions;
    newQuestions[state.current_question].user_answer = answer;
    api.dispatch({ type: SET_QUESTIONS, payload: {
      questions: newQuestions
    }});
  } else if (action.type === SET_QUESTIONS) {
    const state = api.getState();
    if (state.current_question < state.questions.length - 1) {
      api.dispatch({ type: SET_CURRENT_QUESTION, payload: {
        current_question: state.current_question + 1
      }});
    }
  }
  next(action);
};