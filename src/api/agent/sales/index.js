import request from '@/plugin/axios'

// 问题查询
function list(data) {
  let formData = new FormData()
  formData.append('partnerName', data.partnerName)
  formData.append('mobilePhone', data.mobilePhone)
  formData.append('salesmanType', data.salesmanType)
  formData.append('orgId', data.orgId)
  formData.append('provinceId', data.provinceId)
  formData.append('cityId', data.cityId)
  formData.append('regionId', data.regionId)
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  return request({
    url: '/ydh/team/partner/teamPartnerStatistics',
    method: 'post',
    data: formData
  })
}
// 代理级别
function levelData(data){
  return request({
    url: '/common/partner/level',
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
// 查询省份
function queryProvinceRequest(data){
  return request({
    url: '/common/province/display',
    method: 'get',
    params: data
  })
}
// 查询城市
function queryCityRequest(data){
  return request({
    url: '/common/city/display',
    method: 'get',
    params: data
  })
}
// 查询区县
function queryAreaRequest(data){
  return request({
    url: '/common/area/display',
    method: 'get',
    params: data
  })
}
// 查询区域导航
function queryGuideRequest(data){
  return request({
    url: '/common/province/guide',
    method: 'get',
    params: data
  })
}
// 团队业绩统计值
function queryTeamSales(data){
  return request({
    url: '/ydh/team/partner/teamCount',
    method: 'post',
    params: data
  })
}
// 导出业绩数据
function exportsData(data) {
  return request ({
    url: '/ydh/team/partner/reportExport',
    method: 'get',
    params: data,
    responseType: 'arraybuffer'
  })
}
// 导出业绩数据
function salesData(data) {
  return request ({
    url: '/ydh/team/partner/yearCount',
    method: 'post',
    params: data
  })
}

export {  list, levelData, queryOrgRequest, queryProvinceRequest, queryCityRequest, queryAreaRequest, exportsData, queryGuideRequest, queryTeamSales, salesData}
export default { list, levelData, queryOrgRequest, queryProvinceRequest, queryCityRequest, queryAreaRequest, exportsData, queryGuideRequest, queryTeamSales, salesData}
