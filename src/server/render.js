import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import { Provider } from 'react-redux';
import store from '../store';
import Routes from '../app/Routes';

import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

export default ({ clientStats }) => (req, res) => {
  const { js, styles, cssHash } = flushChunks(clientStats, {
    chunkNames: flushChunkNames()
  });

  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="shortcut icon" href="/favicon.ico">
    ${styles}
  </head>
  <body>
    <div id="react-root">${renderToString(
      <StaticRouter location={req.url} context={{}}>
        <Provider store={store}>
          <Routes />
        </Provider>
      </StaticRouter>
    )}</div>
    ${js}
    ${cssHash}
  </body>
</html>
  `);
};
