import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import GistDetails from '../GistDetails';
import * as listActions from '../ContainerListGists/actions';
import * as actions from './actions';
import * as commonActions from '../../reducers/common/actions';

import './styles.scss';
import { Icon } from 'semantic-ui-react';

const toastProps = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 8000
};

class ContainerGistDetails extends React.Component {
  componentDidMount() {
    Modal.setAppElement('#react-root');
  }

  // set toast to render if there's any message
  componentWillUpdate(nextProps) {
    this._renderToastMsg(nextProps);
  }

  _renderToastMsg(props) {
    const { error, toastMsg } = props;

    if (typeof error === 'boolean' && toastMsg !== '')
      toast(toastMsg, {
        type: error ? 'error' : 'success'
      });
  }

  render() {
    let gist = null;
    const { activeItemIndex, changeActiveGistIndex } = this.props;
    if (activeItemIndex !== -1) gist = this.props.gists[activeItemIndex];

    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(10, 10, 10, 0.7)'
      }
    };

    const toastRender = (
      <ToastContainer key="toast-container" {...toastProps} />
    );
    return [
      !gist ? toastRender : null,
      gist && (
        <Modal
          key="ContainerGistDetails__modal"
          isOpen={true}
          style={customStyles}
          onRequestClose={changeActiveGistIndex.bind(null, -1)}>
          {toastRender}
          <Icon
            className="ContainerGistDetails__modal__closebtn"
            inverted
            circular
            name="close"
            onClick={changeActiveGistIndex.bind(null, -1)}
          />
          <div className="ContainerGistDetails__modal__gistdesc">
            {gist.description}
          </div>
          <GistDetails
            onChange={this.props.changeGistLineContent}
            onChangeEditorLanguage={this.props.onChangeEditorLanguage}
            onSaveGistFile={this.props.saveGistFile}
            onChangeFilename={this.props.changeFilename}
            onChangeTabActiveIndex={this.props.changeTabActiveIndex}
            openConfirmDelFile={this.props.openConfirmDelFile}
            deleteFile={this.props.deleteFile}
            gist={gist}
            index={activeItemIndex}
          />
        </Modal>
      )
    ];
  }
}

ContainerGistDetails.propTypes = {
  gists: PropTypes.arrayOf(PropTypes.object),
  activeItemIndex: PropTypes.number.isRequired,
  error: PropTypes.bool.isRequired,
  toastMsg: PropTypes.string,
  // functions
  changeActiveGistIndex: PropTypes.func.isRequired,
  onChangeEditorLanguage: PropTypes.func.isRequired,
  saveGistFile: PropTypes.func.isRequired,
  changeFilename: PropTypes.func.isRequired,
  changeTabActiveIndex: PropTypes.func.isRequired,
  openConfirmDelFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired
};

ContainerGistDetails.defaultProps = {
  gists: [],
  toastMsg: ''
};

// redux portion
const mapStateToProps = (state, props) => {
  return {
    gists: state.listGists.gists,
    activeItemIndex: state.gistDetails.activeItemIndex,
    error: state.common.error,
    toastMsg: state.common.toastMsg
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { ...listActions, ...actions, ...commonActions },
    dispatch
  );
};

ContainerGistDetails = connect(mapStateToProps, mapDispatchToProps)(
  ContainerGistDetails
);

export default ContainerGistDetails;
