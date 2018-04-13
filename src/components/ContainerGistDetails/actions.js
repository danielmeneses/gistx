import { ACTIONS } from './constants';

export const changeActiveGistIndex = index => {
  return {
    type: ACTIONS.CHANGE_ACTIVE_ACCORDION_ITEM_INDEX,
    index
  };
};
