import React from 'react';
import { Confirm, Input, Divider, Checkbox } from 'semantic-ui-react';
import Tags from '../Tags';

export default function Renders() {
  this._renderDeleteFileData = () => {
    const { id, index, fileInfo } = this.props.deleteFileInfo;
    if (id)
      return (
        <Confirm
          key="confirm-delete-file"
          confirmButton="Delete File"
          className="DefaultDialog"
          open={true}
          onConfirm={this.props.saveGistFile.bind(
            null,
            id,
            fileInfo,
            index,
            'delete'
          )}
          onCancel={this.props.openConfirmDelFile.bind(null, null, null, null)}
          content={
            <div>
              <p className="DefaultDialog__title">Delete file</p>
              <p>
                The current file be will be deleted. Do you confirm this action?
              </p>
            </div>
          }
        />
      );
    return null;
  };

  this._renderDeleteGistData = () => {
    const { id, description } = this.props.deleteSnipData;
    if (id)
      return (
        <Confirm
          key="delete-gist-data"
          confirmButton="Delete Gist"
          className="DefaultDialog"
          open={true}
          onConfirm={this._onDeleteGists}
          onCancel={this.props.onDeleteSnipConfirm.bind(null, null, null, null)}
          content={
            <div>
              <p className="DefaultDialog__title">Delete Snippet</p>
              <p>
                Snippet{' '}
                <strong style={{ textTransform: 'uppercase' }}>
                  {description}
                </strong>{' '}
                will be deleted. Do you confirm this action?
              </p>
            </div>
          }
        />
      );
    return null;
  };

  this._renderEditGist = () => {
    const { id, description, index } = this.props.editSnipData;
    if (id && description !== null && description !== undefined)
      return (
        <Confirm
          key="edit-gist"
          confirmButton="Edit description"
          className="DefaultDialog"
          open={true}
          onConfirm={() => {
            if (description.replace(/ /g, '') !== '')
              this.props.saveGistFile(
                id,
                { description },
                index,
                'edit-description'
              );
          }}
          onCancel={this.props.openEditSnip.bind(null, null, null, null)}
          content={
            <div>
              <p className="DefaultDialog__title">Edit snippet description</p>
              <Input
                error={description.replace(/ /g, '') === ''}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                placeholder="Snippet description..."
                onChange={e => {
                  this.props.editSnipDesc(e.target.value);
                }}
                className="DefaultDialog__description"
                type="text"
                value={description}
              />
            </div>
          }
        />
      );
    return null;
  };

  this._renderNewSnipContent = () => {
    const { description, public: _public, selectedTag } = this.props.newGist;
    const { tags: existingTags } = this.props;
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
        <span className="DefaultDialog__label">Tags</span>
        <Tags
          className="DefaultDialog__tags"
          changeCurrentTags={this.props.changeSelectedNewGistTag}
          tags={existingTags}
          currentSelectedTags={selectedTag || null}
        />
      </div>
    );
  };
}
