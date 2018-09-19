import { combineReducers } from 'redux';
import scatter from './scatter';
import api from './api';
import general from './general';

export default combineReducers({
  scatter,
  api,
  general,
});
