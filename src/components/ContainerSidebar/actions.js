import { ACTIONS } from './constants';

export const setVisible = visible => {
  return {
    type: ACTIONS.CHANGE_VISIBILITY,
    visible
  };
};
