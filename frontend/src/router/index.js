import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddView from '../views/AddView.vue'
import CategoryView from '../views/CategoryView.vue'
import PomodoroView from '../views/PomodoroView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/add',
    name: 'Add',
    component: AddView,
    props: route => ({ id: route.query.id })
  },
  {
    path: '/category',
    name: 'Category',
    component: CategoryView
  },
  {
    path: '/pomodoro',
    name: 'Pomodoro',
    component: PomodoroView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
