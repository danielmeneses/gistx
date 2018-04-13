import { ACTIONS } from './constants';

const initialState = {
  visible: false
};

export const sideBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CHANGE_VISIBILITY:
      return { ...state, visible: action.visible };
    default:
      return state;
  }
};
