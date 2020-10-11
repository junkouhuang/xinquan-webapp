import request from '@/plugin/axios'
import qs from 'qs'



// 获取企业入驻列表
const getAuditList = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/getAuditList',
    method: 'post',
    data: data,
  })
}
// 获取资质证书
const credentialsInfo = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/credentialsInfo',
    method: 'post',
    data: qs.stringify(data),
  })
}
//企业审核
const auditEnterprise = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/auditEnterprise',
    method: 'post',
    data: qs.stringify(data),
  })
}
//法人审核
const auditBindEnterprise = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/auditBindEnterprise',
    method: 'post',
    data: qs.stringify(data),
  })
}
//绑定审核申请人信息图片
const getEnterpriseQualificationInfo = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/getEnterpriseQualificationInfo',
    method: 'post',
    data: qs.stringify(data),
  })
}
//结算状态
const getCount = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/getCount',
    method: 'post',
    data: qs.stringify(data),
  })
}
//企业编号有效期更改
const updateEnterpriseInfo = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/updateEnterpriseInfo',
    method: 'post',
    data: qs.stringify(data),
  })
}
//更新未读消息为已读
const updateEunread = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/updateEunread',
    method: 'post',
    data: qs.stringify(data),
  })
}
//待审核未读数量
const getEunreadCount = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/getEunreadCount',
    method: 'post',
    data: qs.stringify(data),
  })
}


//数量
const getEnterpriseCount = data=> {
  return request ({
    url: '/ydh/enterpriseBindApply/getEnterpriseCount',
    method: 'post',
    data: qs.stringify(data),
  })
}



export {
  getAuditList,
  credentialsInfo,
  auditEnterprise,
  auditBindEnterprise,
  getEnterpriseQualificationInfo,
  getCount,
  updateEnterpriseInfo,
  updateEunread,
  getEunreadCount,
  getEnterpriseCount
}
