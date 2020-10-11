import request from '@/plugin/axios'

// 查询城市
function areaRequest(data) {
  let formData = new FormData()

  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  formData.append('city', data.city)
  formData.append('country', data.country)
  formData.append('province', data.province)
  formData.append('district', data.district)
  return request({
    url: '/common/area/list',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

// 新增区县
function addCountry(data){
  return request({
    url: '/common/area/add',
    method: 'post',
    data
  })
}
// 编辑区县
function editCountry(data){
  return request({
    url: '/common/area/edit',
    method: 'post',
    data
  })
}
// 删除区县
function delCountry(data){
  return request({
    url: '/common/area/delete',
    method: 'post',
    data
  })
}
// 批量删除区县
function deleteBatch(data){
  return request({
    url: '/common/area/deleteBatch',
    method: 'post',
    data
  })
}
// 区县详情
function detailCountry(data){
  return request({
    url: '/common/area/details',
    method: 'post',
    data
  })
}


export {  areaRequest, addCountry , editCountry , delCountry , detailCountry , deleteBatch}
export default { areaRequest,  addCountry , editCountry , delCountry , detailCountry , deleteBatch}
