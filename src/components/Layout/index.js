import React from 'react';
import { Sidebar, Segment } from 'semantic-ui-react';
import ContainerSidebar from '../ContainerSidebar';
import ContainerSiteHeader from '../ContainerSiteHeader';
import ContainerGistDetails from '../ContainerGistDetails';
import ContainerTokenPage from '../ContainerTokenPage';

const Layout = ({ children }) => (
  <Sidebar.Pushable
    key="ContainerSidebar"
    className="ContainerSidebar"
    as={Segment}>
    <ContainerTokenPage />
    <ContainerSidebar />
    <ContainerGistDetails />
    <Sidebar.Pusher>
      <Segment basic>
        <div key="list-gist-container">
          <ContainerSiteHeader />
          {children}
        </div>
      </Segment>
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

export default Layout;
