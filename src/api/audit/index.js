import request from '@/plugin/axios'

// 申请列表
function auditList(data) {
  return request ({
    url: '/edu/audit/query',
    method: 'get',
    params: data
  })
}

// 申请详情
function auditDetail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/audit/detail',
    method: 'post',
    data: formData
  })
}

// 提交审核
function submitAudit(data) {
  return request ({
    url: '/edu/audit/submit/audit',
    method: 'post',
    data
  })
}

// 删除审核 
function deleteAudit(data) {
  return request ({
    url: '/edu/audit/delete/audit',
    method: 'post',
    data
  })
}

// 作废审核
function cancelAudit(data) {
  return request ({
    url: '/edu/audit/cancel/audit',
    method: 'post',
    data
  })
}

// 审核不通过
function failedAudit(data) {
  return request ({
    url: '/edu/audit/failed',
    method: 'post',
    data
  })
}

// 审核通过
function passAudit(data) {
  return request ({
    url: '/edu/audit/pass',
    method: 'post',
    data
  })
}

export {
  auditList,
  deleteAudit,
  auditDetail,
  submitAudit,
  cancelAudit,
  failedAudit,
  passAudit
}

export default {
  auditList,
  deleteAudit,
  auditDetail,
  submitAudit,
  cancelAudit,
  failedAudit,
  passAudit
}
