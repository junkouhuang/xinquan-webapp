import request from '@/plugin/axios'
import qs from 'qs'



// 获取用户认证列表
const getAuthenticationList = data=> {
  return request ({
    url: '/ydh/user/authentication/list',
    method: 'post',
    data: data,
  })
}
const findById = data=> {
  return request ({
    url: '/ydh/user/authentication/findById',
    method: 'post',
    data: qs.stringify(data),
  })
}
const updateStatus = data=> {
 return request ({
    url: '/ydh/user/authentication/updateStatus',
    method: 'post',
    data: qs.stringify(data),
  })
};
//状态数量
const findCount = data=> {
    return request ({
        url: '/ydh/user/authentication/findCount',
        method: 'post',
        data: data,
    })
}
//更新未读消息为已读
const updateUaunread = data=> {
    return request ({
        url: '/ydh/user/authentication/updateUaunread',
        method: 'post',
        data: qs.stringify(data),
    })
}
//待审核未读数量
const getUaunreadCount = data=> {
    return request ({
        url: '/ydh/user/authentication/getUaunreadCount',
        method: 'post',
        data: qs.stringify(data),
    })
}





export {
  getAuthenticationList,
  findById,
  updateStatus,
  findCount,
  getUaunreadCount,
  updateUaunread
}
