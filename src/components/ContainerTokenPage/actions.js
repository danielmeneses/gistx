import { ACTIONS } from './constants';

export const changeTokenText = token => {
  return {
    type: ACTIONS.CHANGE_APP_TOKEN,
    token
  };
};
