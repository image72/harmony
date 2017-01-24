import { wrap } from '../utils';


const renderFullPage = (html, initialState) => {
  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);
  const isProduct = config.env === 'production' || process.env.NODE_ENV === 'production';

  return `
    <!doctype html>
    <html>
      <head>
        ${isProduct ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
        <link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${isProduct ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${isProduct ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${isProduct ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};



module.exports = (app) => {
  app.get('/time', wrap(async (req, res, next) => {
    const now = await new Date();
    res.send(`current time is ${now}`);

  }));

  app.get('/*', (req, res, next) => {
    res.send(renderFullPage("", {}))
  })
  app.get('/users', wrap(function* (req, res, next) {
    req.users = yield db.getUsers();
    next();
  }), wrap(function* (req, res) {
    res.send(req.users);
  }));

}
