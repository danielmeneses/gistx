import { ACTIONS } from './constants';

const initialState = {
  tags: {},
  gistTags: {},
  currentSelectedTags: null,
  addTagInfo: {
    visible: false,
    label: '',
    bgColor: '#000000',
    textColor: ''
  }
};

export const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TAGS_DATA:
      return {
        ...state,
        tags: action.tags,
        gistTags: action.gistTags
      };
    case ACTIONS.CHANGE_CURRENT_TAGS:
      return {
        ...state,
        currentSelectedTags: action.value
      };
    case ACTIONS.OPEN_ADD_TAG:
      return {
        ...state,
        addTagInfo: {
          ...state.addTagInfo,
          visible: action.visible
        }
      };
    case ACTIONS.OPEN_ADD_TAG_EDIT_LABEL:
      return {
        ...state,
        addTagInfo: {
          ...state.addTagInfo,
          label: action.label
        }
      };
    case ACTIONS.OPEN_ADD_TAG_EDIT_COLOR:
      return {
        ...state,
        addTagInfo: {
          ...state.addTagInfo,
          color: action.color
        }
      };
    // case ACTIONS.ADD_TAG:
    //   return state;
    // case ACTIONS.EDIT_TAG:
    //   return state;
    // case ACTIONS.ASSOCIATE_TAG_TO_GIST:
    //   return state;
    // case ACTIONS.DELETE_TAG:
    //   return state;
    // case ACTIONS.REMOVE_TAG_FROM_GIST:
    //   return state;
    default:
      return state;
  }
};
