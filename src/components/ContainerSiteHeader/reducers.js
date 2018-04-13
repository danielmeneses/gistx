import { ACTIONS } from './constants';

const initialState = {
  tags: {},
  gistTags: {},
  currentSelectedTags: {}
};

export const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TAGS_DATA:
      return {
        tags: action.tags,
        gistTags: action.gistTags
      };
    case ACTIONS.CHANGE_CURRENT_TAGS:
      return {
        ...state,
        currentSelectedTags: action.value
      };
    case ACTIONS.ADD_TAG:
      return state;
    case ACTIONS.EDIT_TAG:
      return state;
    case ACTIONS.ASSOCIATE_TAG_TO_GIST:
      return state;
    case ACTIONS.DELETE_TAG:
      return state;
    case ACTIONS.REMOVE_TAG_FROM_GIST:
      return state;
    default:
      return state;
  }
};
