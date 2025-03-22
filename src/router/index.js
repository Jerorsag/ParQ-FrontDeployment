import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import EntryView from '../views/EntryView.vue';
import ExitView from '../views/ExitView.vue';
import ParkingConfigurationView from '../views/ParkingConfigurationView.vue';
import ParkingMapsView  from '../views/ParkingMapsView.vue';
import HeroSectionView  from '../views/HeroSectionView.vue';
import ApiStatisticsView  from '../views/ApiStatisticsView.vue';
import CapturePlateView  from '../views/CapturePlateView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  { path: '/entry', name: 'Entry', component: EntryView },
  { path: '/exit', name: 'Exit', component: ExitView },
  { path: '/configuration', name: 'Configuration', component: ParkingConfigurationView },
  { path: '/maps', name: 'Maps', component: ParkingMapsView },
  { path: '/hero', name: 'Hero', component: HeroSectionView },
  { path: '/statistics', name: 'statistics', component: ApiStatisticsView },
  { path: '/capture', name: 'capture', component: CapturePlateView },
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
