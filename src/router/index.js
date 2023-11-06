import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: () => import('../view/Login.vue')
    // },
    // {
    //   path: "/:pathMatch*",
    //   redirect: "/apply"
    // }
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
