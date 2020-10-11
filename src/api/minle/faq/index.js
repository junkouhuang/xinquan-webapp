import request from '@/plugin/axios'

// 问题查询
function list(data) {
  let formData = new FormData()
  formData.append('title', data.title)
  formData.append('source', 2)
  formData.append('type', data.type)
  formData.append('status', data.status)
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  return request({
    url: '/common/faq/list',
    method: 'post',
    data: formData
  })
}
// 添加问题
function save(data) {
  let formData = new FormData()
  formData.append('title', data.title)
  formData.append('source', 2)
  formData.append('type', data.type)
  formData.append('status', data.status)
  formData.append('content', data.content)
  return request({
    url: '/common/faq/add',
    method: 'post',
    data: formData
  })
}
// 修改问题
function update(data) {
  let formData = new FormData()
  formData.append('id', data.id)
  formData.append('title', data.questionTitle)
  formData.append('content', data.questionContent)
  formData.append('type', data.questionType)
  formData.append('status', data.status)
  return request({
    url: '/common/faq/edit',
    method: 'post',
    data: formData
  })
}
// 批量删除问题
function delBatch(data){
  return request({
    url: '/common/faq/deleteBatch',
    method: 'post',
    data
  })
}
// 删除问题
function del(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/faq/delete',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 问题详情
function detail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/faq/detail',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// FAQ状态
function typeFAQ(data){
  return request({
    url: '/common/faq/types',
    method: 'get',
    params: data
  })
}
// FAQ类型
function statusFAQ(data){
  return request({
    url: '/common/faq/status',
    method: 'get',
    params: data
  })
}
// 问题启用
function  enable(id){
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/faq/enable',
    data: formData,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 问题停用
function disable(id){
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/faq/disable',
    data: formData,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 导出问题列表数据
function exportsData() {
  return request ({
    url: '/common/faq/exports',
    method: 'get',
    params: {source:2},
    responseType: 'arraybuffer'
  })
}

export {  detail, list, save, del, delBatch, update, typeFAQ, statusFAQ, disable , enable, exportsData}
export default { detail, list, save, del, delBatch, update, typeFAQ, statusFAQ, disable, enable, exportsData }
