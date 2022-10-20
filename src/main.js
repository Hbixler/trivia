import Vue from 'vue';
import VueRouter from 'vue-router';
import router from './router';
import axios from 'axios';
import store from './store';
import App from './App.vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);

Vue.config.productionTip = true;
Vue.prototype.$axios = axios
Vue.prototype.$store = store;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');