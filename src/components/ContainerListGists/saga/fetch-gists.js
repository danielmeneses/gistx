import logger from 'loglevel';
import { call, put, take } from 'redux-saga/effects';

import { ACTIONS } from '../constants';
import { fetchGistsSuccess } from '../actions';
import { setTagsData } from '../../ContainerSiteHeader/actions';

import {
  setBeachBallVisible,
  clearMessages,
  actionError
} from '../../../reducers/common/actions';
import db from '../../../lib/db';
import storage from '../../../lib/storage';

const { FETCH_GISTS } = ACTIONS;

function* fetchGistsData(action) {
  try {
    const { forceFetch } = action;
    yield put(setBeachBallVisible(true));
    const response = yield call(storage.getGists, { forceFetch });
    yield put(fetchGistsSuccess(response));
    yield put(setTagsData(db.getTags(), db.getGistTags()));
  } catch (e) {
    logger.error(e);
    yield put(actionError(e.message));
  } finally {
    yield put(clearMessages());
    // handle beach ball - UI thing
    yield put(setBeachBallVisible(false));
  }
}

export function* listGistsDataDaemon() {
  while (true) {
    const data = yield take(FETCH_GISTS);
    yield fetchGistsData(data);
  }
}
