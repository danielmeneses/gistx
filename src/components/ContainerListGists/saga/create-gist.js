import { call, put, take } from 'redux-saga/effects';
import githubAPI from '../../../connections/github-api';
import { ACTIONS } from '../constants';
import { fetchGists, showDialogNewSnip } from '../actions';

import {
  setBeachBallVisible,
  clearMessages,
  actionSuccess,
  actionError
} from '../../../reducers/common/actions';

const { CREATE_NEW_SNIPPET } = ACTIONS;

const createGist = gistInfo => {
  return new Promise((resolve, reject) => {
    githubAPI.post(`/gists`, gistInfo, function(error, gist) {
      if (error) reject(error);
      else resolve(gist);
    });
  });
};

function* createGistData(action) {
  try {
    const { snippetInfo } = action;
    yield put(showDialogNewSnip(false));
    yield put(setBeachBallVisible(true));
    yield call(createGist, snippetInfo);
    // reload all gists
    yield put(fetchGists());
    yield put(actionSuccess('Snippet was successfully created!'));
  } catch (e) {
    console.error(e);
    yield put(actionError(e.message));
  } finally {
    yield put(clearMessages());
    // handle beach ball - UI thing
    yield put(setBeachBallVisible(false));
  }
}

export function* createGistDataDaemon() {
  while (true) {
    const data = yield take(CREATE_NEW_SNIPPET);
    yield createGistData(data);
  }
}
