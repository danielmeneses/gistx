import { ACTIONS } from './constants';

const initialState = {
  beachballVisible: false,
  toastMsg: '',
  error: false
};

export const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_BEACH_BALL_VISIBLE:
      return { ...state, beachballVisible: action.visible };
    case ACTIONS.ACTION_ERROR:
      return {
        ...state,
        error: true,
        toastMsg: action.error
      };
    case ACTIONS.ACTION_SUCCESS:
      return {
        ...state,
        error: false,
        toastMsg: action.success
      };
    case ACTIONS.CLEAR_MESSAGES:
      return {
        ...state,
        error: initialState.error,
        toastMsg: initialState.toastMsg
      };
    default:
      return state;
  }
};
