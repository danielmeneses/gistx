import { call, put, take } from 'redux-saga/effects';
import { ACTIONS } from '../constants';
import { setTagsData, openAddTag } from '../actions';
import logger from 'loglevel';

import {
  setBeachBallVisible,
  clearMessages,
  actionSuccess,
  actionError
} from '../../../reducers/common/actions';
import db from '../../../lib/db';

const { ADD_TAG } = ACTIONS;

function* createTagData(action) {
  try {
    const { color, name } = action;
    yield put(openAddTag(false));
    yield put(setBeachBallVisible(true));
    yield call(db.addTag, color.hex, name);
    const tags = yield call(db.getTags);
    const gistTags = yield call(db.getGistTags);
    yield put(setTagsData(tags, gistTags));
    yield put(actionSuccess('Tag was successfully created!'));
  } catch (e) {
    logger.error(e);
    yield put(actionError(e.message));
  } finally {
    yield put(clearMessages());
    // handle beach ball - UI thing
    yield put(setBeachBallVisible(false));
  }
}

export function* createTagtDataDaemon() {
  while (true) {
    const data = yield take(ADD_TAG);
    yield createTagData(data);
  }
}
