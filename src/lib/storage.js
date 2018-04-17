import logger from 'loglevel';
import config from '../../config/main';
import { generateUniqueId, objToQueryString } from './helpers';
import githubAPI from '../connections/github-api';
import db, { CONFIG_GIST_DESCRIPTION } from './db';

const MAX_GISTS_TO_FETCH = 3000;

const removeUnneededProps = async gists => {
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

const getGist = id => {
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

const defaultPagination = { per_page: 100, page: 1, sort: 'date' };
const getAllGists = ({ pagination = defaultPagination } = {}) => {
  return new Promise((resolve, reject) => {
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
              resolve(_gists);
            });
        }
      });
    };
    recurse(pagination);
  });
};

const getItem = key => {
  try {
    const storageGists = window.sessionStorage.getItem(key);
    if (storageGists) return JSON.parse(storageGists);
  } catch (e) {
    logger.error(`Couldn't get item ${key} from sessionStorage:`, e);
  }
};

const setItem = (key, value) => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    logger.error(`Couldn't save item ${key} to sessionStorage:`, e, value);
  }
};

const editGist = (id, gistDataToSave) => {
  return new Promise((resolve, reject) => {
    githubAPI.patch(`/gists/${id}`, gistDataToSave, function(error, gist) {
      if (error) reject(error);
      else resolve(gist);
    });
  });
};

const deleteGist = id => {
  return new Promise((resolve, reject) => {
    githubAPI.del(`/gists/${id}`, function(error, gist) {
      if (error) reject(error);
      else resolve(gist);
    });
  });
};

const createGist = gistInfo => {
  return new Promise((resolve, reject) => {
    githubAPI.post(`/gists`, gistInfo, function(error, gist) {
      if (error) reject(error);
      else resolve(gist);
    });
  });
};

/**
 * localStorage: {
    tokenKeyName: 'gtk'
  },
  sessionStorage: {
    gistsKeyName: 'gdb'
  }
 */

class Storage {
  constructor() {
    this.saveGist = this.saveGist.bind(this);
    this.saveGists = this.saveGists.bind(this);
    this.getGists = this.getGists.bind(this);
    this.getGistDetails = this.getGistDetails.bind(this);
    this.deleteGist = this.deleteGist.bind(this);
    this.createGist = this.createGist.bind(this);
    this.getGistsWithoutConfig = this.getGistsWithoutConfig.bind(this);
  }
  async getGists({ pagination, forceFetch = false } = {}) {
    let gists = getItem(config.sessionStorage.gistsKeyName);
    if (!gists || forceFetch) {
      gists = await getAllGists({ pagination });
      this.saveGists(gists);
    }

    // set config - first load
    if (gists && !db.config)
      for (let i = 0; i < gists.length; i++) {
        const gist = gists[i];
        if (gist.description === CONFIG_GIST_DESCRIPTION) {
          const _gist = await getGist(gist.id);
          db.setConfig({
            content: {
              description: _gist.description,
              files: _gist.files
            },
            id: _gist.id
          });
        }
      }

    return gists;
  }

  async getGistsWithoutConfig(options) {
    const finalGists = [];
    const gists = await this.getGists(options);
    if (gists)
      for (let i = 0; i < gists.length; i++) {
        const gist = gists[i];
        if (gist.description === CONFIG_GIST_DESCRIPTION) continue;
        finalGists.push(gist);
      }
    return finalGists;
  }

  async getGistDetails(id) {
    const gists = await this.getGists();
    for (let i = 0; i < gists.length; i++)
      if (gists[i].id === id) {
        const filenames = Object.keys(gists[i].files);
        const files = gists[i].files;
        // if file content is present then we already have details
        if (files[filenames[0]].content) return gists[i];

        const gistDetails = await getGist(id);
        gists[i] = gistDetails;
        this.saveGists(gists);
        return gistDetails;
      }

    return null;
  }

  async saveGist(id, gistDataToSave) {
    const gists = await this.getGists();
    for (let i = 0; i < gists.length; i++)
      if (gists[i].id === id) {
        const response = await editGist(id, gistDataToSave);
        const gist = await getGist(id);
        gists[i] = gist;
        this.saveGists(gists);
        return response;
      }

    return this;
  }

  async deleteGist(id) {
    await deleteGist(id);
    const gists = await this.getGists();
    const finalGists = [];
    for (let i = 0; i < gists.length; i++)
      if (gists[i].id !== id) finalGists.push(gists[i]);

    this.saveGists(finalGists);
    return finalGists;
  }

  async createGist(gistInfo) {
    const finalGists = [];
    const saveInfo = await createGist(gistInfo);
    const newGist = await getGist(saveInfo.id);
    const gists = await this.getGists();
    finalGists.push(newGist, ...gists);
    this.saveGists(finalGists);
    return newGist;
  }

  saveGists(gists) {
    if (gists) setItem(config.sessionStorage.gistsKeyName, gists);
    return this;
  }
}

export default new Storage();
