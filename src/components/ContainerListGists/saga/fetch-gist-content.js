import { call, put, take } from 'redux-saga/effects';
import githubAPI from '../../../connections/github-api';
import { ACTIONS } from '../constants';
import { setGistInfo } from '../actions';
import { changeActiveGistIndex } from '../../ContainerGistDetails/actions';
import { removeUnneededProps } from './fetch-gists';

import {
  setBeachBallVisible,
  clearMessages,
  actionError
} from '../../../reducers/common/actions';

const { FETCH_GIST_CONTENT } = ACTIONS;

export const getGist = id => {
  return new Promise((resolve, reject) => {
    githubAPI.get(`/gists/${id}`, function(error, gist) {
      if (error) reject(error);
      else
        removeUnneededProps(gist).then(_gists => {
          resolve(_gists[0]);
        });
    });
  });
};

function* fetchGistContentData(action) {
  try {
    const { gistProps: { id, index } } = action;
    yield put(changeActiveGistIndex(index));
    yield put(setBeachBallVisible(true));
    const gist = yield call(getGist, id);
    yield put(setGistInfo(index, gist));
  } catch (e) {
    console.error(e);
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
