import { ACTIONS } from './constants';

const initialState = {
  activeItemIndex: -1
};

export const gistDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.CHANGE_ACTIVE_ACCORDION_ITEM_INDEX:
      return { ...state, activeItemIndex: action.index };
    default:
      return state;
  }
};
