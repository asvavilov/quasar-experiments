import { RouteRecordRaw } from 'vue-router'
import MainLayout from 'layouts/MainLayout.vue'
import MyNewPage from 'pages/MyNewPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },

  {
    path: '/mypage',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MyPage.vue') }
    ]
  },

  {
    path: '/mynewpage',
    component: MainLayout,
    children: [
      { path: '', component: MyNewPage }
    ]

  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
