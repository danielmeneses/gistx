import { combineReducers } from 'redux';

// all reducers
import { routerReducer } from 'react-router-redux';
import { commonReducer } from './common/reducers';
import { listGistsReducer } from '../components/ContainerListGists/reducers';
import { sideBarReducer } from '../components/ContainerSidebar/reducers';
import { tagsReducer } from '../components/ContainerSiteHeader/reducers';
import { gistDetailsReducer } from '../components/ContainerGistDetails/reducers';
import { tokenPageReducer } from '../components/ContainerTokenPage/reducers';

export default combineReducers({
  router: routerReducer,
  common: commonReducer,
  listGists: listGistsReducer,
  sideBar: sideBarReducer,
  tagsManager: tagsReducer,
  gistDetails: gistDetailsReducer,
  tokenPage: tokenPageReducer
});
