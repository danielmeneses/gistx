import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';
import Modal from 'react-modal';
import GistItemFile from '../GistItemFile';
import { shouldComponentUpdate } from '../../lib/helpers';

import './styles.scss';
import { generateUniqueId } from '../../lib/helpers';

class GistDetails extends React.Component {
  constructor(props) {
    super(props);

    // function binding
    this._onSaveGistFile = this._onSaveGistFile.bind(this);
    this._onChangePublic = this._onChangePublic.bind(this);
    this._onChangeFilename = this._onChangeFilename.bind(this);
    this._onTabChange = this._onTabChange.bind(this);
  }

  componentDidMount() {
    Modal.setAppElement('#react-root');
  }

  shouldComponentUpdate(nextProps) {
    return shouldComponentUpdate(nextProps, this.props);
  }

  _onSaveGistFile(fileData) {
    const { id, description } = this.props.gist;
    const gist = {
      description,
      files: fileData
    };
    this.props.onSaveGistFile(id, gist, this.props.index);
  }
  _onChangePublic(e, element) {
    this.props.onChangeGistPublic(this.props.index, element.checked);
  }

  _onTabChange(e, element) {
    const { index } = this.props;
    // if (this.props.isActive === true) return;

    if (element.activeIndex === element.panes.length - 1) {
      const name = `newfile-${generateUniqueId()}.js`;
      this.props.onChangeFilename(index, name, name, true);
    }
    // set active index
    this.props.onChangeTabActiveIndex(
      index,
      this.props.gist.id,
      element.activeIndex
    );
  }

  _onChangeFilename(index, name, newName, fileId, isNew) {
    const { files } = this.props.gist;
    let nameCount = 0;
    Object.keys(files).forEach(key => {
      const curFileId = files[key].fileId;
      if (fileId === curFileId) return;
      if (key === newName || files[key].newName === newName) nameCount++;
    });
    if (nameCount === 0)
      this.props.onChangeFilename(index, name, newName, isNew);
  }
  _renderPanes() {
    const { id, files, public: _public } = this.props.gist;
    const {
      openConfirmDelFile,
      onChangeEditorLanguage,
      deleteFile,
      onChange,
      index
    } = this.props;

    // number of files already saved
    let numSavedFiles = 0;
    Object.keys(files).forEach(key => {
      numSavedFiles += files[key].isNew !== true ? 1 : 0;
    });
    const events = {
      onChange,
      onChangeLanguage: onChangeEditorLanguage,
      onSaveGistFile: this._onSaveGistFile,
      onChangePublic: this._onChangePublic,
      onChangeFilename: this._onChangeFilename,
      openConfirmDelFile: numSavedFiles > 1 ? openConfirmDelFile : null,
      deleteFile
    };

    const commonFields = {
      id,
      public: _public,
      index
    };
    const panes = Object.keys(files).map((filename, i) => ({
      menuItem: files[filename].newName || filename,
      render: () => (
        <Tab.Pane className="GistDetails__accorditem__content__tabs__pane">
          <GistItemFile
            key={`gist-item-file-${i}`}
            file={files[filename]}
            filename={filename}
            {...events}
            {...commonFields}
          />
        </Tab.Pane>
      )
    }));

    // tab for creating a GIST
    panes.push({
      menuItem: '+',
      render: () => (
        <Tab.Pane className="GistDetails__accorditem__content__tabs__pane">
          <GistItemFile
            key="gist-item-file-newfile"
            file={{ id }}
            {...commonFields}
            filename="newfile.js"
            {...events}
          />
        </Tab.Pane>
      )
    });
    return panes;
  }

  render() {
    const { gist } = this.props;
    const panes = this._renderPanes(gist);
    const tabActiveIndex = gist.tabActiveIndex;

    return (
      panes && (
        <Tab
          activeIndex={tabActiveIndex || 0}
          onTabChange={this._onTabChange}
          menu={{
            // color: '#555',
            inverted: true,
            attached: true,
            tabular: false
          }}
          className="GistDetails__accorditem__content__tabs"
          panes={panes}
        />
      )
    );
  }
}

GistDetails.propTypes = {
  gist: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  // functions
  onChange: PropTypes.func.isRequired,
  onChangeEditorLanguage: PropTypes.func.isRequired,
  onSaveGistFile: PropTypes.func.isRequired,
  onChangeFilename: PropTypes.func.isRequired,
  onChangeTabActiveIndex: PropTypes.func.isRequired,
  openConfirmDelFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired
};

export default GistDetails;
