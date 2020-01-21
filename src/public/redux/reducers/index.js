import {combineReducers} from 'redux';

// import all reducer
import friends from './friends';

const rootReducer = combineReducers({
  friends,
});

export default rootReducer;
