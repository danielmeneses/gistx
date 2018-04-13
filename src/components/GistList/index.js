import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import GistListItem from '../GistListItem';
// import { shouldComponentUpdate } from '../../lib/helpers';
import WindowedList from 'react-windowed-list';

let winSize = 600;
try {
  winSize = window.innerHeight - 80;
} catch (e) {}

const CONTAINER_STYLE = {
  height: winSize
};

class GistList extends React.PureComponent {
  constructor(props) {
    super(props);

    // bind functions
    this._onclickGistItem = this._onclickGistItem.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  // shouldComponentUpdate(nextProps) {
  //   return shouldComponentUpdate(nextProps, this.props);
  // }

  _onclickGistItem(e, gistProps) {
    const {
      activeItemIndex,
      changeActiveGistIndex,
      fetchGistContent
      // changeFilename
    } = this.props;
    const { files, index } = gistProps;
    if (activeItemIndex !== index) {
      const keys = Object.keys(files);
      if (!keys.length) changeActiveGistIndex(index);
      else {
        const content = files[keys[0]].content;
        if (content) changeActiveGistIndex(index);
        else fetchGistContent(gistProps);
      }
    } else changeActiveGistIndex(-1);
  }
  _renderItem(i, key) {
    const {
      gists,
      // functions
      onDeleteSnipConfirm,
      onDeleteSnip,
      openEditSnip,
      indexes
    } = this.props;
    return (
      <GistListItem
        key={key}
        gist={gists[i]}
        index={indexes[i]}
        onClick={this._onclickGistItem}
        onDeleteSnipConfirm={onDeleteSnipConfirm}
        onDeleteSnip={onDeleteSnip}
        onOpenEditSnip={openEditSnip}
      />
    );
  }
  render() {
    const { gists } = this.props;

    return (
      <List
        divided
        verticalAlign="middle"
        className="ContainerListGists__gistlist"
        style={CONTAINER_STYLE}>
        <WindowedList
          itemRenderer={this._renderItem}
          length={gists.length}
          type="uniform"
        />
      </List>
    );
  }
}

GistList.propTypes = {
  gists: PropTypes.array,
  indexes: PropTypes.array,
  activeItemIndex: PropTypes.number.isRequired,
  // functions
  onDeleteSnipConfirm: PropTypes.func.isRequired,
  onDeleteSnip: PropTypes.func.isRequired,
  openEditSnip: PropTypes.func.isRequired,
  changeActiveGistIndex: PropTypes.func.isRequired,
  fetchGistContent: PropTypes.func.isRequired
};

GistList.defaultProps = {
  gists: [],
  indexes: []
};

export default GistList;
