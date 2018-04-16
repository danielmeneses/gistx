import { ACTIONS } from './constants';
import { generateUniqueId } from '../../lib/helpers';

const initialState = {
  gists: [],
  loading: true,
  searchValue: '',
  createSnipVisible: false,
  newGist: {
    description: '',
    public: false,
    selectedTag: null
  },
  deleteSnipData: {},
  deleteFileInfo: {},
  editSnipData: {}
};

export const listGistsReducer = (state = initialState, action) => {
  const {
    index,
    gist,
    filename,
    newValue,
    newLanguage,
    _public,
    newFilename
  } = action;

  switch (action.type) {
    case ACTIONS.FETCH_GISTS_SUCCESS:
      return { ...state, gists: action.response };
    case ACTIONS.SET_GIST_INFO:
      return {
        ...state,
        gists: [...state.gists.map((_gist, i) => (i === index ? gist : _gist))]
      };
    case ACTIONS.CHANGE_GIST_LINE_CONTENT:
      return {
        ...state,
        gists: [
          ...state.gists.map((gist, i) => {
            return index === i
              ? {
                  ...gist,
                  files: {
                    ...gist.files,
                    [filename]: { ...gist.files[filename], content: newValue }
                  }
                }
              : gist;
          })
        ]
      };
    case ACTIONS.CHANGE_EDITOR_LANGUAGE:
      // state.gists[index].files[filename].type = newLanguage;
      return {
        ...state,
        gists: [
          ...state.gists.map((gist, i) => {
            return index === i
              ? {
                  ...gist,
                  files: {
                    ...gist.files,
                    [filename]: {
                      ...gist.files[filename],
                      forcedType: newLanguage
                    }
                  }
                }
              : gist;
          })
        ]
      };
    case ACTIONS.SET_FILE_AS_SAVED:
      return {
        ...state,
        gists: [
          ...state.gists.map((gist, i) => {
            return action.index === i
              ? {
                  ...gist,
                  files: {
                    ...gist.files,
                    [filename]: {
                      ...gist.files[filename],
                      isNew: false
                    }
                  }
                }
              : gist;
          })
        ]
      };
    case ACTIONS.SEARCH_GIST:
      return {
        ...state,
        searchValue: action.text
      };
    case ACTIONS.CHANGE_GIST_PUBLIC:
      return {
        ...state,
        gists: [
          ...state.gists.map((gist, i) => {
            return index === i
              ? {
                  ...gist,
                  public: _public
                }
              : gist;
          })
        ]
      };
    case ACTIONS.CHANGE_FILENAME:
      return {
        ...state,
        gists: [
          ...state.gists.map((gist, i) => {
            return index === i
              ? {
                  ...gist,
                  files: {
                    ...gist.files,
                    [filename]: {
                      ...gist.files[filename],
                      newName: newFilename,
                      isNew: action.isNew,
                      forcedType: false,
                      fileId: action.isNew
                        ? generateUniqueId()
                        : gist.files[filename].fileId
                    }
                  }
                }
              : gist;
          })
        ]
      };
    case ACTIONS.SET_FILE_LOADING:
      return {
        ...state,
        gists: [
          ...state.gists.map((gist, i) => {
            return action.index === i
              ? {
                  ...gist,
                  files: {
                    ...gist.files,
                    [action.filename]: {
                      ...gist.files[action.filename],
                      loading: action.loading
                    }
                  }
                }
              : gist;
          })
        ]
      };
    case ACTIONS.OPEN_CREATE_SNIP_DIALOG:
      return Object.assign(
        {},
        state,
        { createSnipVisible: action.visible },
        action.visible === false ? { newGist: { ...initialState.newGist } } : {}
      );
    case ACTIONS.CHANGE_NEW_SNIP_FIELD:
      return {
        ...state,
        newGist: {
          ...state.newGist,
          [action.fieldName]: action.value
        }
      };
    case ACTIONS.CHANGE_SELECTED_NEW_GIST_TAG:
      return {
        ...state,
        newGist: {
          ...state.newGist,
          selectedTag: action.value
        }
      };

    case ACTIONS.DELETE_GIST_CONFIRM:
      return {
        ...state,
        deleteSnipData: {
          id: action.id,
          index: action.index,
          description: action.description
        }
      };
    case ACTIONS.CONFIRM_DELETE_FILE:
      return {
        ...state,
        deleteFileInfo: {
          id: action.id,
          fileInfo: action.fileToDeleteInfo,
          index: action.index
        }
      };
    case ACTIONS.DELETE_FILE:
      return {
        ...state,
        gists: [
          ...state.gists.map((gist, i) => {
            if (index !== i) return gist;
            const newGist = {
              ...gist,
              files: {
                ...gist.files
              }
            };
            delete newGist.files[filename];
            const newIndex =
              newGist.tabActiveIndex === 0 ? 0 : newGist.tabActiveIndex - 1;
            newGist.tabActiveIndex = newIndex;
            return newGist;
          })
        ],
        deleteFileInfo: {}
      };
    case ACTIONS.OPEN_EDIT_SNIP:
      return {
        ...state,
        editSnipData: {
          id: action.id,
          index: action.index,
          description: action.description
        }
      };
    case ACTIONS.EDIT_SNIP_DESCRIPTION:
      return {
        ...state,
        editSnipData: {
          ...state.editSnipData,
          description: action.description
        }
      };
    case ACTIONS.UPDATE_SNIP_DESCRIPTION:
      return {
        ...state,
        gists: [
          ...state.gists.map((gist, i) => {
            if (action.index !== i) return gist;
            const newGist = {
              ...gist,
              description: action.description
            };
            return newGist;
          })
        ],
        editSnipData: {}
      };
    case ACTIONS.CHANGE_TAB_ACTIVE_INDEX:
      return {
        ...state,
        gists: [
          ...state.gists.map((gist, i) => {
            if (action.gistIndex !== i) return gist;
            const newGist = {
              ...gist,
              tabActiveIndex: action.activeIndex
            };
            return newGist;
          })
        ]
      };
    default:
      return state;
  }
};
