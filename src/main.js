import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { createProvider } from './vue-apollo'



// Vue.component('register-actions', require('./components/RegisterActions.vue').default);
// Vue.component('registers-deregistering', require('./components/RegistersDeregistering.vue').default);

Vue.config.productionTip = false

new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app',)
