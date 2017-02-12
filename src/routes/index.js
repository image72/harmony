import path from 'path';
import express from 'express';
import api from './api';
import www from './www';

const staticPath = path.resolve(__dirname, '../../dist/');
console.log(`static path: ${staticPath}`);
const router = (app) => {
  app.get('/search', (req, res, next) => {
    const str = `find that: ${req.query.q}`;
    console.log(str);
    res.send(str);
  })
  // app.use(express.static(publicPath));
  app.use('/static', express.static(staticPath));
  app.use('/', www);
  app.use('/api', api);
}
export default router;
