/*global screen*/
/*eslint no-restricted-globals: ["off", "screen"]*/
/*eslint no-eval: "off"*/
import logger from 'loglevel';
import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import { Icon, Button, Dropdown, Checkbox, Loader } from 'semantic-ui-react';
import langsList, { getLanguageByExtension } from './languages-list';
import { shouldComponentUpdate } from '../../lib/helpers';
import './styles.scss';

const DEFAULT_EDITOR_TEXT = '// Snippet code ...';

let editorHeight = 0;
try {
  editorHeight = window.innerHeight - 180;
} catch (e) {
  editorHeight = 500;
}

class GistItemFile extends React.Component {
  constructor(props) {
    super(props);
    // need a ref for monaco editor - rerender performance issues
    // make this approach the best one
    this.codeEditorRef = React.createRef();
    // bind functions
    this._editorDidMount = this._editorDidMount.bind(this);
    this._onSaveFile = this._onSaveFile.bind(this);
    this._executeJS = this._executeJS.bind(this);
    this._onFilenameKeyUp = this._onFilenameKeyUp.bind(this);
    this._onChangeFilename = this._onChangeFilename.bind(this);
    this._onChangeLanguage = this._onChangeLanguage.bind(this);
    this._changeFileData = this._changeFileData.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return shouldComponentUpdate(nextProps, this.props);
  }

  // componentWillUnmount() {
  //   // we're not using a controled text for monaco editor. Rerendering the component is too
  //   // expensive, so the solution is to only save data to the store on save or the
  //   // component unmount - I guess this is the price to pay for monaco features at this point
  //   this._changeFileData();
  // }
  _changeFileData(content) {
    // update text
    const { content: curContent } = this.props.file;
    const { filename, index } = this.props;
    if (!this.codeEditorRef.current) return;
    const newValue = this.codeEditorRef.current.__current_value;
    const finalFileData = content || newValue;
    if (!finalFileData) return;
    if (finalFileData !== curContent)
      this.props.onChange(finalFileData, index, filename);
  }
  _editorDidMount(editor, monaco) {
    // editor.focus();
    const model = editor.getModel();
    model.updateOptions({ tabSize: 2, defaultTabSize: 2 });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      this._onSaveFile();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      this._executeJS();
    });
  }
  _executeJS() {
    try {
      eval(`(function(){
        ${this.codeEditorRef.current.__current_value}
      }.bind(window)())`);
    } catch (e) {
      logger.error(e);
    }
  }
  _onChangeLanguage(e, element) {
    const { filename } = this.props;
    this.props.onChangeLanguage(this.props.index, filename, element.value);
  }
  _onSaveFile() {
    const content = this.codeEditorRef.current.__current_value;
    const hasContent = content.replace(/ /g, '') !== '';

    const finalFileData = !hasContent ? DEFAULT_EDITOR_TEXT : content;
    this._changeFileData(finalFileData);
    const { filename } = this.props;
    const { newName } = this.props.file;
    const fileData = {
      [filename]: {
        content: finalFileData
      }
    };
    // if has new name
    if (newName) fileData[filename].filename = newName;

    this.props.onSaveGistFile(fileData);
  }
  _onChangeFilename(e) {
    const { fileId, isNew } = this.props.file;
    const { filename, index } = this.props;
    this.props.onChangeFilename(index, filename, e.target.value, fileId, isNew);
  }
  _onFilenameKeyUp(e) {
    if (e.keyCode === 13) this._onSaveFile();
  }
  render() {
    const {
      content,
      forcedType,
      newName,
      isNew,
      fileId,
      raw_url
    } = this.props.file;
    const {
      filename,
      openConfirmDelFile,
      deleteFile,
      index,
      public: _public
    } = this.props;
    // loading might be null - to be sure we're working with a boolean
    const loading = this.props.file.loading === true;

    const _filename = newName !== undefined ? newName : filename;

    let language = null,
      extentions = null;

    if (!forcedType) {
      const langObj = getLanguageByExtension(_filename, langsList);
      language = langObj.language;
      extentions = langObj.extentions;
    } else {
      extentions = forcedType;
      for (let l of langsList)
        if (l.value === forcedType) {
          language = l.text;
          break;
        }
    }

    const defaultMonacoConfig = {
      width: '100%',
      height: editorHeight,
      language: language,
      theme: 'vs-dark'
    };

    const options = {
      selectOnLineNumbers: true,
      scrollBeyondLastLine: false,
      quickSuggestions: false
    };

    let renderDeleteFile = null;
    if (openConfirmDelFile || isNew === true)
      renderDeleteFile = (
        <Icon
          className="GistItemFile__savefile-container__deletebtn"
          name="trash"
          // openConfirmDelFile = (id, fileToDeleteInfo, index)
          onClick={() => {
            if (loading) return;
            // this.componentWillUnmount = () => null;
            if (isNew === true) deleteFile(index, filename);
            else
              openConfirmDelFile(
                this.props.id,
                { files: { [filename]: null } },
                index
              );
          }}
        />
      );

    let editor = null;
    if (content || (!content && isNew))
      editor = (
        <div
          key="GistItemFile__editorwrapper"
          className="GistItemFile__editorwrapper">
          <MonacoEditor
            onChange={this._changeFileData}
            ref={this.codeEditorRef}
            key={`gist-editor-${fileId}`}
            {...defaultMonacoConfig}
            value={typeof content !== 'string' ? DEFAULT_EDITOR_TEXT : content}
            options={options}
            editorDidMount={this._editorDidMount}
          />
        </div>
      );

    const styles = {
      loaderContainer: {
        width: '100%',
        height: editorHeight,
        backgroundColor: 'transparent'
      },
      loader: {
        top: '40%'
      }
    };
    return !editor ? (
      <div style={styles.loaderContainer}>
        <Loader active inline="centered" style={styles.loader} />
      </div>
    ) : (
      [
        editor,
        <div
          key="GistItemFile__savefile-container"
          className="GistItemFile__savefile-container">
          <Button
            as={Button}
            disabled={loading}
            loading={loading}
            primary
            size="small"
            onClick={this._onSaveFile}
            className="GistItemFile__savefile-container__savebtn">
            SAVE
          </Button>
          <a href={raw_url} rel="noopener noreferrer" target="_blank">
            <Icon
              title="Raw file"
              name="attach"
              className="GistItemFile__savefile-container__file-url"
            />
          </a>

          {renderDeleteFile}
          {language === 'javascript' && (
            <Icon
              title="Execute javascript (ctrl/cmd + enter)"
              onClick={this._executeJS}
              name="play"
              className="GistItemFile__savefile-container__executebtn"
            />
          )}
          {isNew && (
            <span className="GistItemFile__savefile-container__notsaved">
              New file, not saved!
            </span>
          )}
          <input
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onKeyUp={this._onFilenameKeyUp}
            onChange={this._onChangeFilename}
            className="GistItemFile__savefile-container__filename"
            type="text"
            value={_filename}
          />
          <Dropdown
            upward={true}
            className="GistItemFile__savefile-container__dropdown"
            value={extentions}
            onChange={this._onChangeLanguage}
            placeholder="State"
            search
            options={langsList}
          />
          <span className="GistItemFile__savefile-container__public-label">
            Public
          </span>
          <Checkbox
            disabled={true}
            className="GistItemFile__savefile-container__public"
            toggle
            checked={_public}
          />
        </div>
      ]
    );
  }
}

GistItemFile.propTypes = {
  file: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  public: PropTypes.bool.isRequired,
  filename: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  // functions
  onChange: PropTypes.func.isRequired,
  onChangeLanguage: PropTypes.func.isRequired,
  onChangeFilename: PropTypes.func.isRequired,
  onSaveGistFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired
};

export default GistItemFile;
