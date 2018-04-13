import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import DefaultDialog from '../DefaultDialog';
import { Input } from 'semantic-ui-react';
import authConfig from '../../../config/main';

class ContainerTokenPage extends React.Component {
  render() {
    const { token, isSetted } = this.props;
    return isSetted ? null : (
      <DefaultDialog
        open={true}
        confirmButton="Save token"
        onConfirm={() => {
          if (token.replace(/ /g, '') !== '') {
            window.localStorage.setItem(
              authConfig.localStorage.tokenKeyName,
              token
            );
            window.location.reload();
          }
        }}
        cancelButton={null}
        onCancel={() => false}
        content={
          <div>
            <p className="DefaultDialog__title">Set your token</p>
            <Input
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              error={!token || token.replace(/ /g, '') === '' ? true : false}
              style={{ width: '100%' }}
              placeholder="Your private gists token..."
              type="text"
              value={this.props.token}
              onChange={e => {
                this.props.changeTokenText(e.target.value);
              }}
            />
            <br />
            <br />
            <p>
              <b>Note:</b> In your github account access 'Settings -> Developer
              settings -> Personal tokens' and create a new token allowing
              access only to 'Gists'. Copy and paste the token in the above
              input. The token will be saved to your browser's localStorage.{' '}
              <b>We don't save, read or use it in any way</b>.
            </p>
          </div>
        }
      />
    );
  }
}

ContainerTokenPage.propTypes = {
  token: PropTypes.string.isRequired,
  isSetted: PropTypes.bool.isRequired
};

// redux portion
const mapStateToProps = (state, props) => {
  return {
    token: state.tokenPage.token,
    isSetted: state.tokenPage.isSetted
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
};

ContainerTokenPage = connect(mapStateToProps, mapDispatchToProps)(
  ContainerTokenPage
);

export default ContainerTokenPage;
