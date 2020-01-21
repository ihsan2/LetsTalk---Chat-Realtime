import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';

import thunkMiddleware from 'redux-thunk';

// import reducer
import rootReducer from '../redux/reducers';

// const logger = createLogger({});
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
