import request from '@/plugin/axios'

// 查询省份
function provinceRequest(data) {
  let formData = new FormData()
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  formData.append('provinceName', data.provinceName)
  formData.append('updator', data.updator)
  return request({
    url: '/common/province/list',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
// 新增省份
function addCountry(data){
  return request({
    url: '/common/province/add',
    method: 'post',
    data,
  })
}
// 编辑省份
function editCountry(data){
  return request({
    url: '/common/province/edit',
    method: 'post',
    data
  })
}
// 删除省份
function delCountry(data){
  return request({
    url: '/common/province/delete',
    method: 'post',
    data
  })
}
// 批量删除省份
function deleteBatch(data){
  return request({
    url: '/common/province/deleteBatch',
    method: 'post',
    data
  })
}
// 省份详情
function detailCountry(data){
  return request({
    url: '/common/province/details',
    method: 'post',
    data
  })
}



export {  provinceRequest, addCountry , editCountry , delCountry , detailCountry , deleteBatch}
export default { provinceRequest, addCountry , editCountry , delCountry , detailCountry , deleteBatch}
