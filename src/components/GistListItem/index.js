import React from 'react';
import PropTypes from 'prop-types';
import { Icon, List } from 'semantic-ui-react';
import moment from 'moment';
import { shouldComponentUpdate } from '../../lib/helpers';

import './styles.scss';

class GistListItem extends React.Component {
  constructor(props) {
    super(props);

    // bind functions
    this._onClickGistListItem = this._onClickGistListItem.bind(this);
    this._onOpenEditSnip = this._onOpenEditSnip.bind(this);
    this._onDeleteSnipConfirm = this._onDeleteSnipConfirm.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return shouldComponentUpdate(nextProps, this.props);
  }

  _onClickGistListItem(e) {
    this.props.onClick(e, {
      ...this.props.gist,
      index: this.props.index
    });
  }

  _onOpenEditSnip(e) {
    e.stopPropagation();
    const { id, description } = this.props.gist;
    this.props.onOpenEditSnip(this.props.index, id, description);
  }

  _onDeleteSnipConfirm(e) {
    e.stopPropagation();
    const { id, description } = this.props.gist;
    this.props.onDeleteSnipConfirm(this.props.index, id, description);
  }

  render() {
    const { description, created_at } = this.props.gist;

    return (
      <List.Item
        onClick={this._onClickGistListItem}
        className="GistListItem__accorditem">
        <List.Content floated="right">
          <span
            onClick={this._onOpenEditSnip}
            className="GistListItem__accorditem__edit">
            <Icon name="edit" />
          </span>
          <span
            onClick={this._onDeleteSnipConfirm}
            className="GistListItem__accorditem__remove">
            <Icon name="trash" />
          </span>
        </List.Content>
        <List.Content>
          <span className="GistListItem__accorditem__date">
            {moment(created_at).format('MMM Do YY')}
          </span>|
          <span className="GistListItem__accorditem__desc">{description}</span>
        </List.Content>
      </List.Item>
    );
  }
}
GistListItem.propTypes = {
  gist: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  // functions
  onOpenEditSnip: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onDeleteSnipConfirm: PropTypes.func.isRequired
};

export default GistListItem;
