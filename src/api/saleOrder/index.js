import request from '@/plugin/axios'
import qs from 'qs'



// 获取销售订单列表
const findSalesOrderList = data=> {
  return request ({
    url: '/ydh/salesOrder/findSalesOrderList',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 销售订单详情
const findSalesOrderDetail = data=> {
  return request ({
    url: '/ydh/salesOrder/findSalesOrderDetail',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 取消订单
const cancelOrder = data=> {
  return request ({
    url: '/ydh/salesOrder/cancelOrder',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 取消订单并退款
const cancelOrderRefund = data=> {
  return request ({
    url: '/ydh/salesOrder/cancelOrderRefund',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 确定退款&&拒绝退款
const auditRefundApply = data=> {
  return request ({
    url: '/ydh/salesOrder/auditRefundApply',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 审核药品
const checkOrder = data=> {
  return request ({
    url: '/ydh/salesOrder/checkOrder',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 确认订单
const artificialCheckOrderEnd = data=> {
  return request ({
    url: '/ydh/salesOrder/artificialCheckOrderEnd',
    method: 'post',
    data: qs.stringify(data),
  })
}
//状态数量
const getExamineCount = data=> {
  return request ({
    url: '/ydh/salesOrder/getExamineCount',
    method: 'post',
    data: qs.stringify(data),
  })
}
//更新未读消息为已读
const updateSunread = data=> {
  return request ({
    url: '/ydh/salesOrder/updateSunread',
    method: 'post',
    data: qs.stringify(data),
  })
}
//待审核未读数量
const getSunreadCount = data=> {
  return request ({
    url: '/ydh/salesOrder/getSunreadCount',
    method: 'post',
    data: qs.stringify(data),
  })
}


export {
  findSalesOrderList,
  findSalesOrderDetail,
  cancelOrder,
  cancelOrderRefund,
  auditRefundApply,
  checkOrder,
artificialCheckOrderEnd,
  getSunreadCount,
  updateSunread,
  getExamineCount
}
