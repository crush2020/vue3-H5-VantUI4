import { createRouter, createWebHashHistory, Router } from 'vue-router';
import routes from './routes';

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

router.beforeEach(async (_to, _from, next) => {
  const title: any = _to.meta.title;
  document.title = title;
  next();
});

export default router;
