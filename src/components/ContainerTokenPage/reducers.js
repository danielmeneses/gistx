import { ACTIONS } from './constants';
import { getToken } from '../../lib/helpers';

const token = getToken();
const initialState = {
  visible: false,
  token: token ? token : '',
  isSetted: Boolean(token)
};

export const tokenPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CHANGE_APP_TOKEN:
      return {
        ...state,
        token: action.token
      };
    default:
      return state;
  }
};
