import request from '@/plugin/axios'

// 查询系统
function countryRequest(data) {
  let formData = new FormData()
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  formData.append('name', data.name)
  return request({
    url: '/common/setting/list',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
// 新增系统
function addCountry(data){
  let formData = new FormData()
  formData.append('value', data.value)
  formData.append('remark', data.remark)
  formData.append('name', data.name)
  return request({
    url: '/common/setting/add',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 编辑系统
function editCountry(data){
  let formData = new FormData()
  formData.append('value', data.value)
  formData.append('remark', data.remark)
  formData.append('name', data.name)
  return request({
    url: '/common/setting/update',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 删除系统
function delCountry(data){
  let formData = new FormData()
  formData.append('name', data.name)
  return request({
    url: '/common/setting/delete',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 系统详情
function detailCountry(data){
  let formData = new FormData()
  formData.append('name', data.name)
  return request({
    url: '/common/setting/detail',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 检验系统参数名是否重复
 function nameExist(data){
  return request({
    url: '/common/setting/validate?name='+ data.name,
    method: 'get',
    params: {},
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
 }



export {  countryRequest , addCountry , editCountry , delCountry , detailCountry , nameExist}
export default { countryRequest , addCountry , editCountry , delCountry, detailCountry , nameExist }
