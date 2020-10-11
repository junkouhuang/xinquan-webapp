import request from '@/plugin/axios'

// 问题查询
function list(data) {
  let formData = new FormData()
  formData.append('name', data.name)
  formData.append('type', data.type)
  formData.append('category', data.category)
  formData.append('status', data.status)
  formData.append('orgId', data.orgId)
  formData.append('start', data.start)
  formData.append('end', data.end)
  formData.append('source', data.source)
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  return request({
    url: '/common/storage/list',
    method: 'post',
    data: formData
  })
}
// 添加资源
function add(data) {
  return request({
    url: '/common/storage/add',
    method: 'post',
    data
  })
}
// 修改资源
function edit(data) {
  return request({
    url: '/common/storage/edit',
    method: 'post',
    data
  })
}
// 批量删除资源
function delBatch(data){
  return request({
    url: '/common/storage/deleteBatch',
    method: 'post',
    data
  })
}
// 删除资源
function del(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/storage/delete',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 资源详情
function detail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/storage/detail',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 状态
function statusData(data){
  return request({
    url: '/common/storage/status',
    method: 'get',
    params: data
  })
}
// 类型
function typesData(data){
  return request({
    url: '/common/storage/types',
    method: 'get',
    params: data
  })
}
// 分类
function categoryData(data){
  return request({
    url: '/common/storage/category',
    method: 'get',
    params: data
  })
}
// 查询机构
function queryOrgRequest(data){
  return request({
    url: '/ydh/mall/enterprise/list',
    method: 'get',
    params: data
  })
}

// 资源上传
function uploadStorage(params) {
  let formData = new FormData();
  formData.append("file", params.file);
  return request({
    url: '/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export {  detail, list, add, del, delBatch, edit, statusData, typesData, categoryData, queryOrgRequest, uploadStorage}
export default { detail, list, add, del, delBatch, edit, statusData, typesData, categoryData, queryOrgRequest, uploadStorage}
