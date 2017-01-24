import api from './api';
import www from './www';

const router = (app) => {
  app.use('/', www);
  app.use('/api', api);
}
export default router;
