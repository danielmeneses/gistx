import { ACTIONS } from './constants';

export const setBeachBallVisible = visible => {
  return {
    type: ACTIONS.SET_BEACH_BALL_VISIBLE,
    visible
  };
};

export const actionError = error => {
  return {
    type: ACTIONS.ACTION_ERROR,
    error
  };
};

export const actionSuccess = success => {
  return {
    type: ACTIONS.ACTION_SUCCESS,
    success
  };
};

export const clearMessages = () => {
  return {
    type: ACTIONS.CLEAR_MESSAGES
  };
};
