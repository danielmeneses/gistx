import { all } from 'redux-saga/effects';
import { listGistsDataDaemon } from './components/ContainerListGists/saga/fetch-gists';
import { fetchGistContentDataDaemon } from './components/ContainerListGists/saga/fetch-gist-content';
import { editGistContentDataDaemon } from './components/ContainerListGists/saga/edit-gist';
import { createGistDataDaemon } from './components/ContainerListGists/saga/create-gist';
import { deleteGistDataDaemon } from './components/ContainerListGists/saga/delete-gist';
export default function* sagas() {
  // yield takeEvery(ACTION, sagaData)
  yield all([
    listGistsDataDaemon(),
    fetchGistContentDataDaemon(),
    editGistContentDataDaemon(),
    createGistDataDaemon(),
    deleteGistDataDaemon()
  ]);
}
