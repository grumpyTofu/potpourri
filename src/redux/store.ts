import { createStore, applyMiddleware } from 'redux';
import * as Quiz from './quiz';

export default createStore(Quiz.reducers, applyMiddleware(Quiz.middleware));
