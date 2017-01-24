import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
// import promiseMiddleware from 'common/promiseMiddleware'


import common from 'reducers/common';
import config from '../../config';

const isDev = process.env.NODE_ENV != 'production' || config.env != 'production';
const reducers = combineReducers({
  common
});
const middlewares = [thunkMiddleware];

if (isDev) {
  middlewares.push(createLogger());
}
const createStoreWithMiddleware = applyMiddleware(
  ...middlewares
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducers, initialState);
}
