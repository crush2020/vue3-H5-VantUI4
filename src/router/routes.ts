export const routes = [
  {
    path: '/',
    redirect: '/loginCheck',
    component: () => import('@/layout/basic/index.vue'),
    children: [
      {
        path: '/gameDownload',
        component: () => import('@/views/gameDownload/index.vue'),
        name: 'gameDownload',
        meta: {
          title: '游戏下载',
          keepAlive: false,
        },
      },
      {
        path: '/downloadRecord',
        component: () => import('@/views/downloadRecord/index.vue'),
        name: 'downloadRecord',
        meta: {
          title: '下载记录',
          keepAlive: false,
        },
      },
      {
        path: '/taskDetails',
        component: () => import('@/views/taskDetails/index.vue'),
        name: 'taskDetails',
        meta: {
          title: '任务详情',
          keepAlive: false,
        },
      },
    ],
  },
  {
    name: 'loginCheck',
    path: '/loginCheck',
    component: () => import('@/views/login/loginCheck.vue'),
    meta: {
      title: '',
      keepAlive: false,
    },
  },
  {
    name: 'noAuth',
    path: '/noAuth',
    component: () => import('@/views/noAuth/index.vue'),
    meta: {
      title: '',
      keepAlive: false,
    },
  },
  // 匹配不到重定向会主页
  {
    // 找不到路由重定向到404页面
    path: '/:pathMatch(.*)',
    redirect: '/Home',
  },
];

export default routes;
