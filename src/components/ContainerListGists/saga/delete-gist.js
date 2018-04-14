import logger from 'loglevel';
import { call, put, take } from 'redux-saga/effects';
import { ACTIONS } from '../constants';
import { fetchGists, onDeleteSnipConfirm } from '../actions';

import {
  setBeachBallVisible,
  clearMessages,
  actionSuccess,
  actionError
} from '../../../reducers/common/actions';
import storage from '../../../lib/storage';

const { DELETE_GIST } = ACTIONS;

function* deleteGistData(action) {
  try {
    const { id } = action;
    yield put(onDeleteSnipConfirm(null, null, null));
    yield put(setBeachBallVisible(true));
    yield call(storage.deleteGist, id);
    // reload all gists
    yield put(fetchGists());
    yield put(actionSuccess('Snippet was successfully deleted!'));
  } catch (e) {
    logger.error(e);
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
