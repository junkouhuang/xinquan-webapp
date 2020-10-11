import request from '@/plugin/axios'

// 查询城市
function cityRequest(data) {
  let formData = new FormData()

  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  formData.append('cityName', data.cityName)
  formData.append('updator', data.updator)
  formData.append('provinceName', data.provinceName)

  return request({
    url: '/common/city/list',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
// 新增城市
function addCountry(data){
  return request({
    url: '/common/city/add',
    method: 'post',
    data
  })
}
// 编辑城市
function editCountry(data){
  return request({
    url: '/common/city/edit',
    method: 'post',
    data
  })
}
// 删除城市
function delCountry(data){
  return request({
    url: '/common/city/delete',
    method: 'post',
    data
  })
}
// 批量删除区县
function deleteBatch(data){
  return request({
    url: '/common/city/deleteBatch',
    method: 'post',
    data
  })
}
// 区县详情
function detailCountry(data){
  return request({
    url: '/common/city/details',
    method: 'post',
    data
  })
}



export {  cityRequest, addCountry , editCountry , delCountry , detailCountry , deleteBatch}
export default { cityRequest, addCountry , editCountry , delCountry , detailCountry , deleteBatch}
