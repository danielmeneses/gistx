import React from 'react';
import { Route } from 'react-router-dom';
import universal from 'react-universal-component';
import { Switch } from 'react-router';
import Layout from '../components/Layout';

const UniversalComponent = universal(props =>
  import(`../components/${props.page}`)
);

const customRoute = (pageName, routeProps) => {
  return (
    <Route
      {...routeProps}
      component={props => {
        return (
          <Layout>
            <UniversalComponent router={props} page={pageName} />
          </Layout>
        );
      }}
    />
  );
};

export default () => (
  <Switch>
    {customRoute('ContainerListGists', { path: '/', exact: true })}
  </Switch>
);
