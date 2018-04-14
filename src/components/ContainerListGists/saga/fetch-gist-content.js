import { call, put, take } from 'redux-saga/effects';
import logger from 'loglevel';
import { ACTIONS } from '../constants';
import { setGistInfo } from '../actions';
import { changeActiveGistIndex } from '../../ContainerGistDetails/actions';

import {
  setBeachBallVisible,
  clearMessages,
  actionError
} from '../../../reducers/common/actions';
import storage from '../../../lib/storage';

const { FETCH_GIST_CONTENT } = ACTIONS;

function* fetchGistContentData(action) {
  try {
    const {
      gistProps: { id, index }
    } = action;
    yield put(changeActiveGistIndex(index));
    yield put(setBeachBallVisible(true));
    const gist = yield call(storage.getGistDetails, id);
    yield put(setGistInfo(index, gist));
  } catch (e) {
    logger.error(e);
    yield put(actionError('Failed to fetch gists!'));
  } finally {
    yield put(clearMessages());
    // handle beach ball - UI thing
    yield put(setBeachBallVisible(false));
  }
}

export function* fetchGistContentDataDaemon() {
  while (true) {
    const data = yield take(FETCH_GIST_CONTENT);
    yield fetchGistContentData(data);
  }
}
