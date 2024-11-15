import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Reset from '../views/Reset.vue'
import Home from '../views/Home.vue'
import UserManagement from '../views/UserManagement.vue';
import TenantManagement from '../views/TenantManagement.vue';
import DepartmentManagement from '../views/DepartmentManagement.vue';
import NewsManagement from '../views/NewsManagement.vue';
import CourseManagement from '../views/CourseManagement.vue';
import MeetingManagement from '../views/MeetingManagement.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/reset',
    name: 'Reset',
    component: Reset
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement
      },
      {
        path: 'tenants',
        name: 'TenantManagement',
        component: TenantManagement
      },
      {
        path: 'departments',
        name: 'DepartmentManagement',
        component: DepartmentManagement
      },
      {
        path: 'news',
        name: 'NewsManagement',
        component: NewsManagement
      },
      {
        path: 'courses',
        name: 'CourseManagement',
        component: CourseManagement
      },
      {
        path: 'meetings',
        name: 'MeetingManagement',
        component: MeetingManagement
      },
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router