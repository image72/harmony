const { env } = require('../controller/process');

const server = (app) => {
  app.get('/env', (req, res, next) => {
    res.json(`${env}`);
  })
}

export default server
