import axios from 'axios'
import cookie from 'js-cookie'
import router from '../../router'
import { Loading, Message, MessageBox } from 'element-ui'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://www.xinquanjk.com'  // 生产环境
    : '/api',  // 开发环境
  timeout: 5000 // 请求超时时间
})
let options = {
  lock: true,
  background: 'rgba(0, 0, 0, 0.05)'
}
let loading, expireMessage
// http request 拦截器
service.interceptors.request.use(
  config => {
    let access_token = cookie.get('access_token')
    if (access_token) {

      if (config.method == 'get') {
        config.params.access_token = access_token
      } else if (config.method == 'post') {
        config.url += `?access_token=${access_token}`
      }
     // config.data = qs.stringify(config.data);
    }
    // 加载中
    loading = Loading.service(options)
    return config
  }
)
// 响应拦截
service.interceptors.response.use(
  res => {
    if (loading) {
      loading.close()
    }
    return res.data
  },
  err => {
    if (loading) {
      loading.close()
    }
    let status = err.response.status
    let url = err.response.request.responseURL
    let isLogin = url.indexOf('/authorize/security/login') >= 0,
        isRevoke = url.indexOf('/authorize/security/revoke') >= 0
    if (status === 401 && !isLogin && !isRevoke) {
      if (expireMessage) return
      expireMessage = 1
      MessageBox.confirm('账号登录已过期，请重新登录', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        expireMessage = 0
        cookie.remove('access_token')
        router.replace('/login')
      })
    }else if(status ===  403 ){
        Message.warning({
            message:err.response.data.data,
            type: 'warning'
        });
    } else if(status >= 500) {
      process.env.NODE_ENV === 'production'
        ? console.error('网络加载失败！')
        : Message.error({
          message: '网络加载失败，请稍后重试！',
          duration: 1500
        })
    }
    return Promise.reject(err)
  }
)

export default service
