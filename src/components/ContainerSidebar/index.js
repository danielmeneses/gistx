import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Sidebar, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as actions from './actions';

import './styles.scss';

class ContainerSidebar extends React.Component {
  render() {
    const { visible } = this.props;
    return (
      <Sidebar
        as={Menu}
        animation="push"
        width="thin"
        visible={visible}
        icon="labeled"
        vertical
        inverted>
        <Menu.Item name="home">
          <Link className="ContainerSidebar__menu__link" to="/">
            Snippets
          </Link>
        </Menu.Item>
      </Sidebar>
    );
  }
}

ContainerSidebar.propTypes = {
  visible: PropTypes.bool.isRequired
};

// redux portion
const mapStateToProps = (state, props) => {
  return {
    visible: state.sideBar.visible
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
};

ContainerSidebar = connect(mapStateToProps, mapDispatchToProps)(
  ContainerSidebar
);

export default ContainerSidebar;
