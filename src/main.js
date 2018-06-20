import Vue from 'vue'
import App from './App.vue'
import RespButton from './index';

Vue.use(RespButton)

new Vue({
  el: '#app',
  render: h => h(App)
})
