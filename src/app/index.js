import React from 'react';
import ReactDOM from 'react-dom';
import AppRoot from './AppRoot';
import { AppContainer } from 'react-hot-loader';

import 'semantic-ui-css/semantic.css';
import 'react-select/dist/react-select.css';

// import 'semantic-ui-css/components/reset.css';
// import 'semantic-ui-css/components/site.css';
// import 'semantic-ui-css/components/menu.css';
// import 'semantic-ui-css/components/accordion.css';
// import 'semantic-ui-css/components/button.css';
// import 'semantic-ui-css/components/checkbox.css';
// import 'semantic-ui-css/components/dimmer.css';
// import 'semantic-ui-css/components/divider.css';
// import 'semantic-ui-css/components/grid.css';
// import 'semantic-ui-css/components/icon.css';
// import 'semantic-ui-css/components/input.css';
// import 'semantic-ui-css/components/loader.css';
// import 'semantic-ui-css/components/modal.css';
// import 'semantic-ui-css/components/segment.css';
// import 'semantic-ui-css/components/sidebar.css';
// import 'semantic-ui-css/components/tab.css';
// import 'semantic-ui-css/components/dropdown.css';

function render(Component) {
  ReactDOM.hydrate(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('react-root')
  );
}
render(AppRoot);

if (module.hot)
  module.hot.accept('./AppRoot.js', () => {
    const NewAppRoot = require('./AppRoot.js').default;
    render(NewAppRoot);
  });
