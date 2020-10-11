import request from '@/plugin/axios'
import qs from 'qs'



// 获取证件列表
const getCredentialsList = data=> {
  return request ({
    url: '/ydh/documentsReview/findDisplay',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 获取证书详情
const changeTheDetails = data=> {
  return request ({
    url: '/ydh/documentsReview/changeTheDetails',
    method: 'post',
    data: qs.stringify(data),
  })
}
//企业审核
const auditCredentials = data=> {
  return request ({
    url: '/ydh/documentsReview/audit',
    method: 'post',
    data: qs.stringify(data),
  })
}
//审核记录列表
const list = data=> {
  return request ({
    url: '/ydh/documentsReview/list',
    method: 'post',
    data: data,
  })
}
//更新未读消息为已读
const updateEpunread = data=> {
  return request ({
    url: '/ydh/documentsReview/updateEpunread',
    method: 'post',
    data: qs.stringify(data),
  })
}
//待审核未读数量
const getEpunreadCount = data=> {
  return request ({
    url: '/ydh/documentsReview/getEpunreadCount',
    method: 'post',
    data: qs.stringify(data),
  })
}


//
const getDocumentsCount = data=> {
  return request ({
    url: '/ydh/documentsReview/getDocumentsCount',
    method: 'post',
    data: qs.stringify(data),
  })
}

export {
  getCredentialsList,
  changeTheDetails,
  auditCredentials,
  list,
  updateEpunread,
  getEpunreadCount,
  getDocumentsCount
}
