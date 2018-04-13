import { ACTIONS } from './constants';

export const fetchGists = (forceFetch = true) => {
  return {
    type: ACTIONS.FETCH_GISTS,
    forceFetch
  };
};

export const fetchGistsSuccess = response => {
  return {
    type: ACTIONS.FETCH_GISTS_SUCCESS,
    response
  };
};

export const fetchGistContent = gistProps => {
  return {
    type: ACTIONS.FETCH_GIST_CONTENT,
    gistProps
  };
};

export const setGistInfo = (index, gist) => {
  return {
    type: ACTIONS.SET_GIST_INFO,
    index,
    gist
  };
};

export const changeGistLineContent = (newValue, index, filename) => {
  return {
    type: ACTIONS.CHANGE_GIST_LINE_CONTENT,
    newValue,
    index,
    filename
  };
};

export const onChangeEditorLanguage = (index, filename, newLanguage) => {
  return {
    type: ACTIONS.CHANGE_EDITOR_LANGUAGE,
    index,
    filename,
    newLanguage
  };
};

export const saveGistFile = (id, gistDataToSave, index, context) => {
  return {
    type: ACTIONS.SAVE_GIST_FILE,
    id,
    gistDataToSave,
    index,
    context
  };
};

export const searchGist = text => {
  return {
    type: ACTIONS.SEARCH_GIST,
    text
  };
};

export const changeGistPublic = (index, _public) => {
  return {
    type: ACTIONS.CHANGE_GIST_PUBLIC,
    index,
    _public
  };
};

export const changeFilename = (index, filename, newFilename, isNew) => {
  return {
    type: ACTIONS.CHANGE_FILENAME,
    index,
    filename,
    newFilename,
    isNew
  };
};

export const showDialogNewSnip = visible => {
  return {
    type: ACTIONS.OPEN_CREATE_SNIP_DIALOG,
    visible
  };
};

export const changeNewSnippetField = (fieldName, value) => {
  return {
    type: ACTIONS.CHANGE_NEW_SNIP_FIELD,
    fieldName,
    value
  };
};

export const createNewSnippet = snippetInfo => {
  return {
    type: ACTIONS.CREATE_NEW_SNIPPET,
    snippetInfo
  };
};

export const onDeleteSnipConfirm = (index, id, description) => {
  return {
    type: ACTIONS.DELETE_GIST_CONFIRM,
    index,
    id,
    description
  };
};

export const onDeleteSnip = (index, id) => {
  return {
    type: ACTIONS.DELETE_GIST,
    index,
    id
  };
};

export const openConfirmDelFile = (id, fileToDeleteInfo, index) => {
  return {
    type: ACTIONS.CONFIRM_DELETE_FILE,
    id,
    fileToDeleteInfo,
    index
  };
};

export const deleteFile = (index, filename) => {
  return {
    type: ACTIONS.DELETE_FILE,
    index,
    filename
  };
};

export const openEditSnip = (index, id, description) => {
  return {
    type: ACTIONS.OPEN_EDIT_SNIP,
    index,
    id,
    description
  };
};

export const editSnipDesc = description => {
  return {
    type: ACTIONS.EDIT_SNIP_DESCRIPTION,
    description
  };
};

export const updateSnipDesc = (index, description) => {
  return {
    type: ACTIONS.UPDATE_SNIP_DESCRIPTION,
    index,
    description
  };
};

export const changeTabActiveIndex = (gistIndex, id, activeIndex) => {
  return {
    type: ACTIONS.CHANGE_TAB_ACTIVE_INDEX,
    gistIndex,
    id,
    activeIndex
  };
};

export const setFileAsSaved = (index, id, filename) => {
  return {
    type: ACTIONS.SET_FILE_AS_SAVED,
    index,
    id,
    filename
  };
};

export const setFileLoading = (index, filename, loading) => {
  return {
    type: ACTIONS.SET_FILE_LOADING,
    index,
    filename,
    loading
  };
};
