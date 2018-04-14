import { call, put, take } from 'redux-saga/effects';
import { ACTIONS } from '../constants';
import { fetchGists, showDialogNewSnip } from '../actions';
import logger from 'loglevel';

import {
  setBeachBallVisible,
  clearMessages,
  actionSuccess,
  actionError
} from '../../../reducers/common/actions';
import storage from '../../../lib/storage';

const { CREATE_NEW_SNIPPET } = ACTIONS;

function* createGistData(action) {
  try {
    const { snippetInfo } = action;
    yield put(showDialogNewSnip(false));
    yield put(setBeachBallVisible(true));
    yield call(storage.createGist, snippetInfo);
    // reload all gists
    yield put(fetchGists());
    yield put(actionSuccess('Snippet was successfully created!'));
  } catch (e) {
    logger.error(e);
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
