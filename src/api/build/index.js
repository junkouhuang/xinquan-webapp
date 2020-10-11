import request from '@/plugin/axios'
import qs from 'qs'



// 获取建档列表
const getByconditionFindList = data=> {
  return request ({
    url: '/ydh/archives/getByconditionFindList',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 建档详情
const credentialInfo = data=> {
  return request ({
    url: '/ydh/archives/credentialInfo',
    method: 'post',
    data:  qs.stringify(data),
  })
}
//审核
const audit = data=> {
  return request ({
    url: '/ydh/archives/audit',
    method: 'post',
    data: qs.stringify(data),
  })
}
//状态数量
const getExamineCount = data=> {
  return request ({
    url: '/ydh/archives/getExamineCount',
    method: 'post',
    data: qs.stringify(data),
  })
}
//修改企业备案号
const updateErpId = data=> {
  return request ({
    url: '/ydh/archives/updateErpId',
    method: 'post',
    data: qs.stringify(data),
  })
}

//更新未读消息为已读
const updateAunread = data=> {
  return request ({
    url: '/ydh/archives/updateAunread',
    method: 'post',
    data: qs.stringify(data),
  })
}
//待审核未读数量
const getAunreadCount = data=> {
  return request ({
    url: '/ydh/archives/getAunreadCount',
    method: 'post',
    data: qs.stringify(data),
  })
}






export {
  getByconditionFindList,
  credentialInfo,
  audit,
  getExamineCount,
  updateErpId,
  updateAunread,
  getAunreadCount
}
