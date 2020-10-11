import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import axios from './plugin/axios'
import qs from 'qs'
import cookie from 'js-cookie'
import ElementUI from 'element-ui'
import dayjs from 'dayjs'
import utils from './utils'
import validate from './utils/validate'

import HighchartsVue from 'highcharts-vue'

import './assets/style/element-variables.scss'
import './assets/style/public.scss'

Vue.config.productionTip = false

// 定义一个全局过滤器实现日期格式化
Vue.filter('datefmt', (input, str) => input ? dayjs(input).format(str) : '')

Vue.prototype.axios = axios;
Vue.prototype.qs = qs;
Vue.prototype.cookie = cookie;
Vue.prototype.utils = utils;
Vue.prototype.validate = validate;

Vue.use(ElementUI)

Vue.use(HighchartsVue)

const plugins = { router, store} //, axios, cookie, utils, validate 

new Vue({
  ...plugins,
  render: h => h(App)
}).$mount('#app')

/**权限指令**/
Vue.directive('has', {
  bind: function (el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.style.display = 'none';
    }
  }
});
//权限检查方法
Vue.prototype.$_has = function (value) {
  let isExist = false;
  let buttonperms = store.state.account.resources || JSON.parse(localStorage.getItem('setAccountInfo'));
  // 权限列表
  for (let i in  buttonperms) {
    for(let j in buttonperms[i].children){
      for(let k in buttonperms[i].children[j].children){
        for(let g in buttonperms[i].children[j].children[k].children){
          if(buttonperms[i].children[j].children[k].children[g].resKey == value){
            isExist = true;
            break;
          }
        }
      }
    }
  }
  return isExist;
};


