import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/apply',
      name: 'Apply',
      component: () => import('../views/ApplyView.vue')
    },
    {
      path: '/code',
      name: 'SmsCode',
      component: () => import('../views/SmsCodeView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: "/:pathMatch*",
      redirect: "/apply"
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('token')
  if (to.path !== '/login') {
    isLogin ? next() : next('/login')
  } else {
    next()
  }
})

export default router
