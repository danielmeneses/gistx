import { call, put, take } from 'redux-saga/effects';
import githubAPI from '../../../connections/github-api';
import { ACTIONS } from '../constants';
import { fetchGists, onDeleteSnipConfirm } from '../actions';

import {
  setBeachBallVisible,
  clearMessages,
  actionSuccess,
  actionError
} from '../../../reducers/common/actions';

const { DELETE_GIST } = ACTIONS;

const deleteGist = id => {
  return new Promise((resolve, reject) => {
    githubAPI.del(`/gists/${id}`, function(error, gist) {
      if (error) reject(error);
      else resolve(gist);
    });
  });
};

function* deleteGistData(action) {
  try {
    const { id } = action;
    yield put(onDeleteSnipConfirm(null, null, null));
    yield put(setBeachBallVisible(true));
    yield call(deleteGist, id);
    // reload all gists
    yield put(fetchGists());
    yield put(actionSuccess('Snippet was successfully deleted!'));
  } catch (e) {
    console.error(e);
    yield put(actionError('Something went wrong. Please try again later!'));
  } finally {
    yield put(clearMessages());
    // handle beach ball - UI thing
    yield put(setBeachBallVisible(false));
  }
}

export function* deleteGistDataDaemon() {
  while (true) {
    const data = yield take(DELETE_GIST);
    yield deleteGistData(data);
  }
}
