import Vue from 'vue'
import VueRouter from 'vue-router';
import router from './router';
import store from './store';
import App from './App.vue';
// import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(VueRouter);

Vue.config.productionTip = false
// Vue.prototype.$http = axios

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')