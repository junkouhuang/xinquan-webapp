import request from '@/plugin/axios'

// 问题查询
function list(data) {
  let formData = new FormData()
  formData.append('start', data.start)
  formData.append('end', data.end)
  formData.append('type', data.type)
  formData.append('operator', data.operator)
  formData.append('accept', data.accept)
  formData.append('level', data.level)
  formData.append('category', data.category)
  formData.append('method', data.method)
  formData.append('status', data.status)
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  return request({
    url: '/minle/order/find',
    method: 'post',
    data
  })
}
// 添加反馈
function add(data) {
  return request({
    url: '/common/feedback/add',
    method: 'post',
    data
  })
}
// 修改反馈
function edit(data) {
  return request({
    url: '/common/feedback/edit',
    method: 'post',
    data
  })
}
// 批量删除反馈
function delBatch(data){
  return request({
    url: '/common/feedback/deleteBatch',
    method: 'post',
    data
  })
}
// 删除反馈
function del(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/feedback/delete',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 反馈详情
function detail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request({
    url: '/common/feedback/detail',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 订单状态
function orderStatus(data){
  return request({
    url: '/common/minle/order/status',
    method: 'get',
    params: data
  })
}
// 支付方式
function paymentWays(data){
  return request({
    url: '/common/payment/ways',
    method: 'get',
    params: data
  })
}
// 订单类型
function orderTypes(data){
  return request({
    url: '/common/minle/order/types',
    method: 'get',
    params: data
  })
}
// 抵扣类型
function deductionTypes(data){
  return request({
    url: '/common/minle/deduction/ways',
    method: 'get',
    params: data
  })
}

// 快递公司
function expressCompany(data){
  return request({
    url: '/common/express/company/codes',
    method: 'get',
    params: data
  })
}

// 导出问题列表数据
function exportsData() {
  return request ({
    url: '/common/feedback/exports',
    method: 'get',
    params: {},
    responseType: 'arraybuffer'
  })
}

export {  detail, list, add, del, delBatch, edit, orderStatus, paymentWays, orderTypes, deductionTypes, expressCompany, exportsData}
export default { detail, list, add, del, delBatch, edit, orderStatus, paymentWays, orderTypes, deductionTypes, expressCompany, exportsData}
