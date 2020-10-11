import request from '@/plugin/axios'
import qs from 'qs'



// 获取合伙人列表
const applyRecordList = data=> {
  return request ({
    url: '/ydh/user/agent/applyRecord',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 合伙人详情
const partnerDetail = data=> {
  return request ({
    url: '/ydh/user/agent/partnerDetail',
    method: 'post',
    data:  qs.stringify(data),
  })
}
//审核
const examine = data=> {
  return request ({
    url: '/ydh/user/agent/examine',
    method: 'post',
    data: qs.stringify(data),
  })
}
//状态数量
const getExamineCount = data=> {
  return request ({
    url: '/ydh/user/agent/getExamineCount',
    method: 'post',
    data: qs.stringify(data),
  })
}
//更新未读消息为已读
const updateEaunread = data=> {
  return request ({
    url: '/ydh/user/agent/updateEaunread',
    method: 'post',
    data: qs.stringify(data),
  })
}
//待审核未读数量
const getEaunreadCount = data=> {
  return request ({
    url: '/ydh/user/agent/getEaunreadCount',
    method: 'post',
    data: qs.stringify(data),
  })
}




export {
  applyRecordList,
  partnerDetail,
  examine,
  getExamineCount,
  getEaunreadCount,
  updateEaunread
}
