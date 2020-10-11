import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import cookie from 'js-cookie'
import axios from './plugin/axios'

const FIRST_LOGIN = 'firstLogin'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    access_token: cookie.get('access_token') || '',
    account: {},
    isCollapse: cookie.get('isCollapse') || 0,
    firstLogin: false,
    menu: [],
    menuDetail: [],
  },
  mutations: {
    setToken (state, token) {
      state.access_token = token
    },
    setAccountInfo (state, info) {
      state.account = info
    },
    changeCollapse (state, data) {
      state.isCollapse = data
      cookie.set('isCollapse', data)
    },
    changeFirstLogin (state, data) {
      state.firstLogin = data
    },
    setMenuInfo (state, info) {
      state.menu = info
    },
    setMenuDetail(state, info) {
      state.menuDetail = info
    },
  },
  actions: {
    login ({ commit }, user) {
      let data = new FormData()
      data.append('username', user.accountName);
      data.append('password', user.password);
      data.append('rookie', false)
      data.append('passcode', '')
      return new Promise((resolve, reject) => {
        axios.post('/authorize/security/login', data).then(res => {
          const token = res.data.token.access_token;
          if (res.returnCode == 'ERR_0000' && token) {
            commit('setToken', token)
            cookie.set('access_token', token, { expires: 2 / 24 })
            resolve()
          } else {
            reject(null)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    logout ({ commit, state }) {
      axios.delete(`/authorize/security/revoke?access_token=${state.access_token}`)
      commit('setToken', '')
      commit('setAccountInfo', '')
      localStorage.removeItem('setAccountInfo');
      cookie.remove('access_token')
    },
    fetchAccountInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        axios.post('/authorizes/account/resource').then(res => {
          if (res.returnCode == 'ERR_0000') {
            commit('setAccountInfo', res.data);
            localStorage.setItem('setAccountInfo',JSON.stringify(res.data))
            // 判断是否首次登录，提示修改密码
            if (!state.firstLogin && res.data.firstLoginFlag === 1 && cookie.get(FIRST_LOGIN) != 1) {
              cookie.set(FIRST_LOGIN, 1)
              commit('changeFirstLogin', true)
            }else{
              cookie.set(FIRST_LOGIN, 0)
              commit('changeFirstLogin', false)
            }
            let menu = res.data.resources
            commit('setMenuInfo', res.data.resources)
            if(router.history.current.fullPath!='/home'){
              let arr = []
              menu.forEach(item => {
                item.children && item.children.forEach(item2 => {
                  item2.children && item2.children.forEach(item3 => {
                    if(item3.resUrl == router.history.current.fullPath) {
                      item3.children && item3.children.forEach(item4 => {
                        arr.push(item4.resKey)
                      })
                      commit('setMenuDetail', arr)
                    }
                  })
                })
              })
            }
            resolve(res.data)
          } else {
            reject()
          }
        })
      })
    },
  }
})
