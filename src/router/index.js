import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import CourtTour from '../views/CourtTour.vue'
import Booking from '../views/Booking.vue'
import Invoice from '../views/Invoice.vue'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/courts',
    name: 'CourtTour',
    component: CourtTour,
  },
  {
    path: '/booking',
    name: 'Booking',
    component: Booking,
  },
  {
    path: '/invoice/:bookingCode',
    name: 'Invoice',
    component: Invoice,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
