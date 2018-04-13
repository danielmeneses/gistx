import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import sagaRoot from './saga';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const middlewareArr = [sagaMiddleware];

// add logger if env is DEV
if (process.env.NODE_ENV === 'development') middlewareArr.push(logger);

const middleware = applyMiddleware(...middlewareArr);

export default createStore(reducers, middleware);

// then run the saga
sagaMiddleware.run(sagaRoot);
