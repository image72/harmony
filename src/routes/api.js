import express from 'express';
const router = express.Router();
const { env } = require('../controller/process');


router.get('/env', (req, res, next) => {
  res.json(`${JSON.stringify(env)}`);
})


export default router;
