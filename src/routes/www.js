import express from 'express';
const router = express.Router();

import { wrap, renderFullPage } from '../utils';



router.get('/random', (req, res, next) => {
  res.send(`random:  ${Math.random()}`);
})
router.get('/time', (req, res, next) => {
  res.send(`now: ${new Date()}`);
})
router.get('/home', (req, res, next) => {
  res.send(renderFullPage(`${new Date()} ${Math.random()}`));
})
router.get('/*', (req, res, next) => {
  res.send(renderFullPage())
})

export default router;
