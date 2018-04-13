import { call, put, take } from 'redux-saga/effects';
import githubAPI from '../../../connections/github-api';
import { ACTIONS } from '../constants';
import {
  deleteFile,
  openConfirmDelFile,
  updateSnipDesc,
  editSnipDesc,
  setFileAsSaved,
  setFileLoading
} from '../actions';
import { changeActiveGistIndex } from '../../ContainerGistDetails/actions';
import {
  clearMessages,
  actionSuccess,
  actionError
} from '../../../reducers/common/actions';

const { SAVE_GIST_FILE } = ACTIONS;

const editGist = (id, gistDataToSave) => {
  return new Promise((resolve, reject) => {
    githubAPI.patch(`/gists/${id}`, gistDataToSave, function(error, gist) {
      if (error) reject(error);
      else resolve(gist);
    });
  });
};

function* editGistContentData(action) {
  const { id, gistDataToSave, index, context } = action;
  const filename = gistDataToSave.files
    ? Object.keys(gistDataToSave.files)[0]
    : null;
  try {
    if (context !== 'edit-description')
      yield put(setFileLoading(index, filename, true));

    if (context === 'delete') yield put(openConfirmDelFile(null, null, null));
    else if (context === 'edit-description') yield put(editSnipDesc(null));

    yield call(editGist, id, gistDataToSave);
    let msg = 'File successfully updated!';

    if (context === 'delete') {
      yield put(deleteFile(index, filename));
      yield put(changeActiveGistIndex(index));
      msg = 'File successfully deleted!';
    } else if (context === 'edit-description') {
      msg = 'Description successfully updated!';
      yield put(updateSnipDesc(index, gistDataToSave.description));
    } else {
      const filename = Object.keys(gistDataToSave.files)[0];
      yield put(setFileAsSaved(index, id, filename));
    }

    yield put(actionSuccess(msg));
  } catch (e) {
    console.error(e);
    yield put(actionError('Something went wrong. Please try again later!'));
  } finally {
    yield put(clearMessages());
    // handle beach ball - UI thing
    if (context !== 'delete' && context !== 'edit-description')
      yield put(setFileLoading(index, filename, false));
  }
}

export function* editGistContentDataDaemon() {
  while (true) {
    const data = yield take(SAVE_GIST_FILE);
    yield editGistContentData(data);
  }
}
