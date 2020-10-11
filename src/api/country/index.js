import request from '@/plugin/axios'

// 查询国家
function countryRequest(data) {
  let formData = new FormData()
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  formData.append('countryName', data.countryName)
  formData.append('updator', data.updator)
  return request({
    url: '/common/country/list',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
// 新增国家
function addCountry(data){
  return request({
    url: '/common/country/add',
    method: 'post',
    data
  })
}
// 编辑国家
function editCountry(data){
  return request({
    url: '/common/country/edit',
    method: 'post',
    data
  })
}
// 删除国家
function delCountry(data){
  return request({
    url: '/common/country/delete',
    method: 'post',
    data
  })
}
// 批量删除国家
function deleteBatch(data){
  return request({
    url: '/common/country/deleteBatch',
    method: 'post',
    data
  })
}
// 国家详情
function detailCountry(data){
  return request({
    url: '/common/country/details',
    method: 'post',
    data
  })
}




export {  countryRequest , addCountry , editCountry , delCountry , detailCountry , deleteBatch}
export default { countryRequest , addCountry , editCountry , delCountry, detailCountry , deleteBatch}
