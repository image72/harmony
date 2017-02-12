import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app = express();
import routes from './routes';

const config = require('../config');
const isDev = process.env.NODE_ENV != 'production' && config.env != 'production';

app.use(cookieParser());
app.use(bodyParser.json({
  type: 'application/json',
  limit: '50mb',
  extended: false,
  parameterLimit: 10000
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false,
  parameterLimit: 10000
}));
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/public', express.static(path.join(__dirname, '../public')));


if (isDev) {
  // require('./middleware/webpack')(app);
}
routes(app);
const server = (port = config.port) => {
  return app.listen(port,  (err, result) => {
    if(err){ console.log(err); }
    console.log(`Server running on port ${config.port} ${config.env}`);
  });
}

if (!module.parent) server(config.port);

module.exports = server;
