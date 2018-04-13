import React from 'react';
import PropTypes from 'prop-types';
import { Confirm } from 'semantic-ui-react';
import { shouldComponentUpdate } from '../../lib/helpers';
import './styles.scss';

class DefaultDialog extends React.Component {
  shouldComponentUpdate(nextProps) {
    return shouldComponentUpdate(nextProps, this.props);
  }

  render() {
    const { open, onCancel, content, confirmButton, cancelButton } = this.props;
    return (
      <Confirm
        confirmButton={confirmButton}
        cancelButton={cancelButton}
        className="DefaultDialog"
        open={open}
        onCancel={onCancel}
        onConfirm={this.props.onConfirm}
        content={content}
      />
    );
  }
}

DefaultDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmButton: PropTypes.string.isRequired,
  cancelButton: PropTypes.string,
  content: PropTypes.object.isRequired
};

DefaultDialog.defaultProps = {
  cancelButton: 'Cancel'
};

export default DefaultDialog;
