import { call, put, take } from 'redux-saga/effects';

import { ACTIONS } from '../constants';
import { fetchGistsSuccess } from '../actions';
import githubAPI from '../../../connections/github-api';
import { getGist } from './fetch-gist-content';
import { setTagsData } from '../../ContainerSiteHeader/actions';

import {
  setBeachBallVisible,
  clearMessages,
  actionError
} from '../../../reducers/common/actions';
import { generateUniqueId } from '../../../lib/helpers';
import db, { CONFIG_GIST_DESCRIPTION } from '../../../lib/db';
import auth from '../../../../config/main';

const { FETCH_GISTS } = ACTIONS;
const MAX_GISTS_TO_FETCH = 3000;

const objToQueryString = obj => {
  const query = [];
  Object.keys(obj).reduce((all, key, index) => {
    let item = '';
    if (index > 0) item += '&';
    item += `${key}=${obj[key]}`;
    query.push(item);
    return query;
  }, query);
  return query.join('&');
};

export const removeUnneededProps = async (gists, searchConfig = false) => {
  if (!gists) return;

  if (typeof gists.length !== 'number') gists = [gists];

  const finalGists = [];
  const config = {
    created_at: true,
    description: true,
    updated_at: true,
    url: true,
    id: true,
    public: true,
    files: true
  };
  for (let i = 0; i < gists.length; i++) {
    const gist = gists[i];
    if (searchConfig && gist.description === CONFIG_GIST_DESCRIPTION) {
      const _gist = await getGist(gist.id);
      db.setConfig({
        content: {
          description: _gist.description,
          files: _gist.files
        },
        id: _gist.id
      });
      continue;
    }

    const newGist = {};
    Object.keys(gist).forEach(key => {
      if (config[key]) {
        newGist[key] = gist[key];
        // add fileId to each file
        if (key === 'files' && Object.keys(gist[key]).length)
          Object.keys(gist[key]).forEach(filename => {
            gist[key][filename].fileId = generateUniqueId();
          });
      }
    });
    if (Object.keys(newGist).length) finalGists.push(newGist);
  }

  return finalGists;
};

const defaultPagination = { per_page: 100, page: 1, sort: 'date' };
export const getAllGists = ({
  pagination = defaultPagination,
  forceFetch = true
} = {}) => {
  return new Promise((resolve, reject) => {
    if (forceFetch === false)
      try {
        const storageGists = window.sessionStorage.setItem(
          auth.sessionStorage.gistsKeyName
        );
        if (storageGists) resolve(JSON.parse(storageGists));
      } catch (e) {
        console.error(`Couldn't get gists from sessionStorage`, e);
      }

    if (!githubAPI) resolve([]);
    const gists = [];
    let lastPage = 0;
    // pages: "<https://api.github.com/gists?per_page=30&page=2&sort=date&1522834728470=>; rel="next", <https://api.github.com/gists?per_page=30&page=3&sort=date&1522834728470=>; rel="last""
    const recurse = pagination => {
      githubAPI.get('/gists?' + objToQueryString(pagination), function(
        error,
        data,
        requestData
      ) {
        if (error) reject(error);
        else {
          gists.push(...data);
          if (!lastPage && requestData.headers.hasOwnProperty('link')) {
            const links = requestData.headers.link.split(',');
            links.forEach(link => {
              const data = link.split(';');
              const isLast = data[1].indexOf('rel="last"') > -1;
              if (isLast) {
                const matchs = data[0].match(/(\?|&)page=([0-9]+)&/);
                lastPage = parseInt(matchs[2], 10);
              }
            });
          }
          // fetch more
          if (gists.length < MAX_GISTS_TO_FETCH && lastPage > pagination.page) {
            const nextPage = pagination.page + 1;
            recurse({ ...pagination, page: nextPage });
          } else
            removeUnneededProps(gists, true).then(_gists => {
              try {
                window.sessionStorage.setItem(
                  auth.sessionStorage.gistsKeyName,
                  JSON.stringify(_gists)
                );
              } catch (e) {
                console.error(`Couldn't save gists to sessionStorage`, e);
              }
              resolve(_gists);
            });
        }
      });
    };
    recurse(pagination);
  });
};

function* fetchGistsData(action) {
  try {
    const { forceFetch } = action;
    yield put(setBeachBallVisible(true));
    const response = yield call(getAllGists, { forceFetch });
    yield put(fetchGistsSuccess(response));
    yield put(setTagsData(db.getTags(), db.getGistTags()));
  } catch (e) {
    console.error(e);
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
