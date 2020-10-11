import request from '@/plugin/axios'

// 问题查询
function list(data) {
  let formData = new FormData()
  formData.append('start', data.start)
  formData.append('end', data.end)
  formData.append('type', data.type)
  formData.append('operator', data.operator)
  formData.append('accept', data.accept)
  formData.append('level', data.level)
  formData.append('category', data.category)
  formData.append('method', data.method)
  formData.append('status', data.status)
  formData.append('source', 2)
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  return request({
    url: '/common/feedback/list',
    method: 'post',
    data: formData
  })
}
// 添加反馈
function add(data) {
  return request({
    url: '/common/feedback/add',
    method: 'post',
    data
  })
}
// 修改反馈
function edit(data) {
  return request({
    url: '/common/feedback/edit',
    method: 'post',
    data
  })
}
// 批量删除反馈
function delBatch(data){
  return request({
    url: '/common/feedback/deleteBatch',
    method: 'post',
    data
  })
}
// 删除反馈
function del(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/feedback/delete',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 反馈详情
function detail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/feedback/detail',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 维护人
function operatorFB(data){
  return request({
    url: '/authorizes/account/display',
    method: 'get',
    params: data
  })
}
// 反馈任务状态
function serviceStatusFB(data){
  return request({
    url: '/common/feedback/service/status',
    method: 'get',
    params: data
  })
}
// 反馈服务方式
function serviceMethodsFB(data){
  return request({
    url: '/common/feedback/service/methods',
    method: 'get',
    params: data
  })
}
// 反馈问题类别
function problemCategoryFB(data){
  return request({
    url: '/common/feedback/problem/category',
    method: 'get',
    params: data
  })
}
// 反馈问题级别
function problemLevelsFB(data){
  return request({
    url: '/common/feedback/problem/levels',
    method: 'get',
    params: data
  })
}
// 反馈受理类型
function acceptanceTypesFB(data){
  return request({
    url: '/common/feedback/acceptance/types',
    method: 'get',
    params: data
  })
}

// 客户类型
function customerTypesFB(data){
  return request({
    url: '/common/customer/types',
    method: 'get',
    params: data
  })
}

// 导出问题列表数据
function exportsData() {
  return request ({
    url: '/common/feedback/exports',
    method: 'get',
    params: {source:2},
    responseType: 'arraybuffer'
  })
}

export {  detail, list, add, del, delBatch, edit, serviceStatusFB, serviceMethodsFB, problemCategoryFB, problemLevelsFB, acceptanceTypesFB, customerTypesFB, operatorFB, exportsData}
export default { detail, list, add, del, delBatch, edit, serviceStatusFB, serviceMethodsFB, problemCategoryFB, problemLevelsFB, acceptanceTypesFB, customerTypesFB, operatorFB, exportsData}
