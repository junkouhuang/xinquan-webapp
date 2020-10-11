import request from '@/plugin/axios'
  // 查询机构
 function searchRequest(data){
    return request({
      url: '/edu/organization/query',
      method: 'get',
      params: data
    })
  }

  //添加机构
function addRequest(data) {
    return request({
      url: '/edu/organization/add',
      method: 'post',
      data
    })
  }
  //修改机构信息
  function updateRequest(data){
    return request({
      url: '/edu/organization/update',
      method: 'post',
      data
    })
  }
  //删除机构
  function delRequest(id){
    let formData = new FormData()
    formData.append('id', id)
    return request({
      url: '/edu/organization/delete',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  //查询机构详情
  function detailRequest(data){
    return request({
      url: '/edu/organization/detail',
      method: 'post',
      data
    })
  }
  //批量删除机构
  function delAllRequest(data){
    return request({
      url: '/edu/organization/batch/delete',
      method: 'post',
      data
    })
  }
  //校验机构编码是否已经存在
  function existRequest(data){
    return request({
      url: '/edu/organization/checkOrgCodeExists',
      method: 'post',
      data
    })
  }
  //校验机构名称是否已经存在
  function nameRequest(data){
    return request({
      url: '/edu/organization/checkOrgNameExists',
      method: 'post',
      data
    })
  }
  // 查询国家
  function countryRequest(){
    return request({
      url: '/common/country/display',
      method: 'get',
      params: {}
    })
  }
  //查询省份
  function provinceRequest(data){
    return request({
      url: '/common/province/display?country='+data,
      method: 'get',
      params: {}
    })
  }
  // 查询市
  function cityRequest(data){
    return request({
      url: '/common/city/display',
      method: 'get',
      params: data
    })
  }
  // 查询市级以下
  function  cityDown(data){
    return request({
      url: '/common/area/display',
      method: 'get',
      params: data
    })
  }
  // function cityDetail(data){
  //   return request({
  //     url: '/common/area/detail',
  //     method: 'get',
  //     params: data
  //   })
  // }
  // 查询区域
  function areaRequest(){
    return request({
      url: '/common/area',
      method: 'get',
      params: {}
    })
  }
  // 查询类型
  function typeRequest(){
    return request({
      url: '/common/org/types',
      method: 'get',
      params: {}
    })
  }
  export {
    searchRequest,
    addRequest,
    updateRequest,
    delRequest,
    detailRequest,
    delAllRequest,
    existRequest,
    nameRequest,
    countryRequest,
    provinceRequest,
    cityRequest,
    cityDown,
    // cityDetail,
    areaRequest,
    typeRequest
  }
  
  export default {
    searchRequest,
    addRequest,
    updateRequest,
    delRequest,
    detailRequest,
    delAllRequest,
    existRequest,
    nameRequest,
    countryRequest,
    provinceRequest,
    cityRequest,
    cityDown,
    // cityDetail,
    areaRequest,
    typeRequest
  }
  
  