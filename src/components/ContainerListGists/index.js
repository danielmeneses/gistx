import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Loader, Divider, Checkbox, Input } from 'semantic-ui-react';
import * as actions from './actions';
import * as sideBarActions from '../ContainerSidebar/actions';
import { changeActiveGistIndex } from '../ContainerGistDetails/actions';
import DefaultDialog from '../DefaultDialog';
import { generateUniqueId } from '../../lib/helpers';
import GistList from '../GistList';
import Renders from './renders';

import './styles.scss';

class ContainerListGists extends React.Component {
  constructor(props) {
    super(props);
    // set render functions from Renders obj
    Renders.call(this);

    // bind functions
    this._onCreateNewSnip = this._onCreateNewSnip.bind(this);
    this._onNewSnipDescChange = this._onNewSnipDescChange.bind(this);
    this._onNewSnipPubChange = this._onNewSnipPubChange.bind(this);
    this._onNewSnipTagAdded = this._onNewSnipTagAdded.bind(this);
    this._onNewSnipTagsChange = this._onNewSnipTagsChange.bind(this);
    this._onDeleteGists = this._onDeleteGists.bind(this);
  }

  componentDidMount() {
    if (this.props.token) this.props.fetchGists(false);
  }

  _onCreateNewSnip() {
    const { description, public: _public } = this.props.newGist;
    if (description.replace(/ /g, '') !== '')
      this.props.createNewSnippet({
        description,
        public: _public,
        files: {
          [`new-file-${generateUniqueId()}.js`]: {
            content: '// my snippet'
          }
        }
      });
  }

  // jsx in renders.js
  _onNewSnipDescChange(e, element) {
    this.props.changeNewSnippetField('description', element.value);
  }
  // jsx in renders.js
  _onNewSnipPubChange(e, element) {
    this.props.changeNewSnippetField('public', element.checked);
  }
  // @TODO - implement tags first
  _onNewSnipTagAdded(e, element) {}
  _onNewSnipTagsChange(e, element) {}

  _onDeleteGists(e) {
    const { index, id } = this.props.deleteSnipData;
    this.props.onDeleteSnip(index, id);
  }

  _filterGists() {
    const { searchValue, currentSelectedTags, gists } = this.props;
    const isPubTag = currentSelectedTags && currentSelectedTags.value === '1';
    const isPrivTag = currentSelectedTags && currentSelectedTags.value === '2';

    const toValidate = [];
    if (searchValue.replace(/ /g, '') !== '') toValidate.push('description');
    if (isPubTag) toValidate.push('isPubTag');
    if (isPrivTag) toValidate.push('isPrivTag');

    if (toValidate.length === 0)
      return {
        finalGists: gists,
        indexes: Object.keys(gists).map(key => parseInt(key, 10))
      };

    const text = searchValue.toLowerCase();
    const indexes = [];
    const finalGists = gists.filter((item, index) => {
      for (let i = 0; i < toValidate.length; i++) {
        const key = toValidate[i];
        switch (key) {
          case 'description':
            if (item.description.toLowerCase().indexOf(text) === -1)
              return false;
            break;
          case 'isPubTag':
            if (item.public !== true) return false;
            break;
          case 'isPrivTag':
            if (item.public !== false) return false;
            break;
          default:
        }
      }
      indexes.push(index);
      return true;
    });

    return { finalGists, indexes };
  }

  _renderNewSnipContent() {
    const { description, public: _public } = this.props.newGist;
    // const { tags: existingTags } = this.props;
    return (
      <div key="new-snip-content">
        <p className="DefaultDialog__title">Create new Snippet</p>
        <Input
          error={description.replace(/ /g, '') === ''}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Snippet description..."
          onChange={this._onNewSnipDescChange}
          className="DefaultDialog__description"
          type="text"
          value={description}
        />
        <Divider className="DefaultDialog__divider" />
        <span className="DefaultDialog__label">Public</span>
        <Checkbox
          onChange={this._onNewSnipPubChange}
          className="DefaultDialog__public"
          toggle
          checked={_public}
        />
        {/* <span className="DefaultDialog__label">Tags</span>
        <Tags
          className="DefaultDialog__tags"
          changeCurrentTags={() => {
            console.log('To be implemented!!');
          }}
          tags={existingTags}
        /> */}
      </div>
    );
  }

  render() {
    const {
      activeItemIndex,
      loading,
      searchValue,
      createSnipVisible,
      currentSelectedTags,
      gists,
      changeGistLineContent,
      onChangeEditorLanguage,
      saveGistFile,
      changeGistPublic,
      changeFilename,
      onDeleteSnipConfirm,
      onDeleteSnip,
      openConfirmDelFile,
      openEditSnip,
      deleteFile,
      changeTabActiveIndex,
      changeActiveGistIndex,
      fetchGistContent
    } = this.props;

    const deleteFileRendered = this._renderDeleteFileData();
    const deleteGistRendered = this._renderDeleteGistData();
    const editGistRendered = this._renderEditGist();

    let { finalGists, indexes } = this._filterGists();

    return [
      deleteFileRendered,
      deleteGistRendered,
      editGistRendered,
      createSnipVisible && (
        <DefaultDialog
          confirmButton={'Create Snippet'}
          key="create-gist-dialog"
          content={this._renderNewSnipContent()}
          open={createSnipVisible}
          onCancel={this.props.showDialogNewSnip.bind(null, false)}
          onConfirm={this._onCreateNewSnip}
        />
      ),
      gists.length > 0 && (
        <GistList
          key="gist-accordion-container"
          activeItemIndex={activeItemIndex}
          searchValue={searchValue}
          currentSelectedTags={currentSelectedTags}
          gists={finalGists}
          indexes={indexes}
          changeGistLineContent={changeGistLineContent}
          onChangeEditorLanguage={onChangeEditorLanguage}
          saveGistFile={saveGistFile}
          changeGistPublic={changeGistPublic}
          changeFilename={changeFilename}
          onDeleteSnipConfirm={onDeleteSnipConfirm}
          onDeleteSnip={onDeleteSnip}
          openConfirmDelFile={openConfirmDelFile}
          openEditSnip={openEditSnip}
          deleteFile={deleteFile}
          changeTabActiveIndex={changeTabActiveIndex}
          changeActiveGistIndex={changeActiveGistIndex}
          fetchGistContent={fetchGistContent}
        />
      ),
      !gists.length &&
        loading && (
          <div
            key="ContainerListGists__loader-container"
            className="ContainerListGists__loader-container">
            <Loader
              className="ContainerListGists__loader-container__loader"
              active
            />
          </div>
        )
    ];
  }
}

ContainerListGists.propTypes = {
  activeItemIndex: PropTypes.number.isRequired,
  gistTags: PropTypes.object,
  gists: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool.isRequired,
  newGist: PropTypes.object,
  tags: PropTypes.object,
  page: PropTypes.string,
  router: PropTypes.object,
  deleteSnipData: PropTypes.object,
  deleteFileInfo: PropTypes.object,
  editSnipData: PropTypes.object,
  currentSelectedTags: PropTypes.object,
  searchValue: PropTypes.string,
  token: PropTypes.string,
  // functions
  onChangeEditorLanguage: PropTypes.func.isRequired,
  onDeleteSnip: PropTypes.func.isRequired,
  onDeleteSnipConfirm: PropTypes.func.isRequired,
  openConfirmDelFile: PropTypes.func.isRequired,
  openEditSnip: PropTypes.func.isRequired,
  saveGistFile: PropTypes.func.isRequired,
  searchGist: PropTypes.func.isRequired,
  setFileAsSaved: PropTypes.func.isRequired,
  setFileLoading: PropTypes.func.isRequired,
  setGistInfo: PropTypes.func.isRequired,
  setVisible: PropTypes.func.isRequired,
  showDialogNewSnip: PropTypes.func.isRequired,
  updateSnipDesc: PropTypes.func.isRequired
};

ContainerListGists.defaultProps = {
  gistTags: {},
  gists: [],
  newGist: {},
  tags: {},
  page: '',
  router: {},
  deleteSnipData: {},
  deleteFileInfo: {},
  editSnipData: {},
  currentSelectedTags: {},
  searchValue: ''
};

// redux portion
const mapStateToProps = (state, props) => {
  return {
    gists: state.listGists.gists,
    loading: state.common.beachballVisible,
    activeItemIndex: state.gistDetails.activeItemIndex,
    searchValue: state.listGists.searchValue,
    createSnipVisible: state.listGists.createSnipVisible,
    newGist: state.listGists.newGist,
    deleteSnipData: state.listGists.deleteSnipData,
    deleteFileInfo: state.listGists.deleteFileInfo,
    editSnipData: state.listGists.editSnipData,
    gistTags: state.tagsManager.gistTags,
    tags: state.tagsManager.tags,
    currentSelectedTags: state.tagsManager.currentSelectedTags,
    token: state.tokenPage.token
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { ...actions, ...sideBarActions, changeActiveGistIndex },
    dispatch
  );
};

ContainerListGists = connect(mapStateToProps, mapDispatchToProps)(
  ContainerListGists
);

export default ContainerListGists;
