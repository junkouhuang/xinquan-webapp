import request from '@/plugin/axios'

// 团队业绩统计值
function queryTeamSales(data){
  return request({
    url: '/ydh/team/partner/teamCount',
    method: 'post',
    params: data
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

export {  queryTeamSales, salesData}
export default { queryTeamSales, salesData}
