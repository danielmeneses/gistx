import { ACTIONS } from './constants';

export const addTag = (name, color) => {
  return {
    type: ACTIONS.ADD_TAG,
    name,
    color
  };
};

export const editTag = (id, name, color) => {
  return {
    type: ACTIONS.EDIT_TAG,
    name,
    id,
    color
  };
};

export const deleteTag = id => {
  return {
    type: ACTIONS.DELETE_TAG,
    id
  };
};

export const associateTagToGist = (tagId, gistId) => {
  return {
    type: ACTIONS.ASSOCIATE_TAG_TO_GIST,
    tagId,
    gistId
  };
};

export const removeTagFromGist = (tagId, gistId) => {
  return {
    type: ACTIONS.REMOVE_TAG_FROM_GIST,
    tagId,
    gistId
  };
};

export const setTagsData = (tags, gistTags) => {
  return {
    type: ACTIONS.SET_TAGS_DATA,
    tags,
    gistTags
  };
};

export const changeCurrentTags = value => {
  return {
    type: ACTIONS.CHANGE_CURRENT_TAGS,
    value
  };
};

export const openAddTag = visible => {
  return {
    type: ACTIONS.OPEN_ADD_TAG,
    visible
  };
};

export const editAddTagLabel = label => {
  return {
    type: ACTIONS.OPEN_ADD_TAG_EDIT_LABEL,
    label
  };
};

export const editAddTagColor = color => {
  return {
    type: ACTIONS.OPEN_ADD_TAG_EDIT_COLOR,
    color
  };
};
