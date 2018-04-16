import React from 'react';
import { Grid, Icon, Input, Loader, Confirm } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CirclePicker } from 'react-color';
import * as actions from './actions';
import { setVisible } from '../ContainerSidebar/actions';
import { searchGist, showDialogNewSnip } from '../ContainerListGists/actions';
import Tags from '../Tags';

import './styles.scss';

class ContainerSiteHeader extends React.Component {
  constructor(props) {
    super(props);

    // bind functions
    this._onSearch = this._onSearch.bind(this);
    this._renderAddNewTag = this._renderAddNewTag.bind(this);
  }

  _onSearch(e, element) {
    this.props.searchGist(element.value);
  }

  _renderAddNewTag() {
    const {
      addTagInfo: { visible, label, color },
      // functions
      editAddTagLabel,
      editAddTagColor,
      openAddTag,
      addTag
    } = this.props;
    const maxLabelLength = 10;
    if (visible === true)
      return (
        <Confirm
          key="edit-gist"
          confirmButton="Create Tag"
          className="DefaultDialog"
          open={true}
          onConfirm={() => {
            if (
              label.replace(
                / /g,
                '' && label.length <= maxLabelLength && color
              ) !== ''
            )
              addTag(label, color);
          }}
          onCancel={openAddTag.bind(null, false)}
          content={
            <div>
              <p className="DefaultDialog__title">Create new Tag</p>
              <Input
                error={label.replace(/ /g, '') === ''}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                maxLength="10"
                placeholder="Tag label name..."
                onChange={e => {
                  editAddTagLabel(e.target.value);
                }}
                className="DefaultDialog__description"
                type="text"
                value={label}
              />
              <CirclePicker
                className="DefaultDialog__tagcolors"
                color={color}
                onChange={editAddTagColor}
              />
            </div>
          }
        />
      );
    return null;
  }

  render() {
    const {
      sideBarVisible,
      searchValue,
      loading,
      gists,
      activeItemIndex,
      tags,
      currentSelectedTags,
      changeCurrentTags,
      openAddTag,
      // setVisible,
      showDialogNewSnip
    } = this.props;
    const addTagRender = this._renderAddNewTag();
    return (
      <Grid className="ContainerSiteHeader__header">
        <Grid.Row columns={16}>
          <Grid.Column width={12}>
            <Icon
              className="ContainerSiteHeader__header__closeopen"
              circular={true}
              // onClick={setVisible.bind(null, !sideBarVisible)}
              name={sideBarVisible ? 'arrow left' : 'arrow right'}
            />
            <span className="ContainerSiteHeader__header__logo">GISTx</span>
            <Input
              placeholder="Search snippet..."
              value={searchValue}
              className="ContainerSiteHeader__header__search"
              type="text"
              onChange={this._onSearch}
              icon="search"
            />
            <Tags
              changeCurrentTags={changeCurrentTags}
              tags={tags}
              currentSelectedTags={currentSelectedTags}
            />
            <Icon
              name="tags"
              className="ContainerSiteHeader__header__addtag"
              onClick={openAddTag.bind(null, true)}
            />
            {addTagRender}
            {loading &&
              gists.length &&
              activeItemIndex === -1 && (
                <Loader
                  style={{
                    marginLeft: '5rem',
                    marginTop: '-.4rem'
                  }}
                  active
                  inline
                />
              )}
          </Grid.Column>
          <Grid.Column
            width={4}
            className="ContainerSiteHeader__header__col-right">
            <Icon
              onClick={showDialogNewSnip.bind(null, true)}
              className="ContainerSiteHeader__header__col-right__new-gist"
              name="add circle"
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

ContainerSiteHeader.propTypes = {
  gistTags: PropTypes.object, // @TODO
  gists: PropTypes.arrayOf(PropTypes.object),
  currentSelectedTags: PropTypes.object,
  searchValue: PropTypes.string,
  tags: PropTypes.object.isRequired,
  sideBarVisible: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  activeItemIndex: PropTypes.number.isRequired,
  addTagInfo: PropTypes.object.isRequired,
  // functions
  setVisible: PropTypes.func.isRequired,
  changeCurrentTags: PropTypes.func.isRequired,
  showDialogNewSnip: PropTypes.func.isRequired,
  searchGist: PropTypes.func.isRequired
};

ContainerSiteHeader.defaultProps = {
  gistTags: {}, // @TODO
  gists: [],
  currentSelectedTags: null,
  searchValue: ''
};

// redux portion
const mapStateToProps = (state, props) => {
  return {
    tags: state.tagsManager.tags,
    gistTags: state.tagsManager.gistTags,
    addTagInfo: state.tagsManager.addTagInfo,
    currentSelectedTags: state.tagsManager.currentSelectedTags,
    sideBarVisible: state.sideBar.visible,
    searchValue: state.listGists.searchValue,
    loading: state.common.beachballVisible,
    gists: state.listGists.gists,
    activeItemIndex: state.gistDetails.activeItemIndex
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { ...actions, setVisible, searchGist, showDialogNewSnip },
    dispatch
  );
};

ContainerSiteHeader = connect(mapStateToProps, mapDispatchToProps)(
  ContainerSiteHeader
);

export default ContainerSiteHeader;
