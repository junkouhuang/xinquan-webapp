import request from '@/plugin/axios'
import qs from 'qs'



// 获取结算列表
const settleList = data=> {
  return request ({
    url: '/ydh/agentCommissionSettlement/settleList',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 结算详情
const settleDetail = data=> {
  return request ({
    url: '/ydh/agentCommissionSettlement/settleDetail',
    method: 'post',
    data: qs.stringify(data),
  })
}
//修改
const audit = data=> {
  return request ({
    url: '/ydh/agentCommissionSettlement/audit',
    method: 'post',
    data: qs.stringify(data),
  })
}
//支付
const settlePayUrl = data=> {
  return request ({
    url: '/ydh/agentCommissionSettlement/settlePayUrl',
    method: 'post',
    data: qs.stringify(data),
  })
}
//结算状态
const adminCountSettle = data=> {
  return request ({
    url: '/ydh/agentCommissionSettlement/adminCountSettle',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 确认提交
const confirmReceipt = data=> {
  return request ({
    url: '/ydh/agentCommissionSettlement/confirmReceipt',
    method: 'post',
    data: qs.stringify(data),
  })
}
//更新未读消息为已读
const updateRunread = data=> {
  return request ({
    url: '/ydh/agentCommissionSettlement/updateRunread',
    method: 'post',
    data: qs.stringify(data),
  })
}
//待审核未读数量
const getRunreadCount = data=> {
  return request ({
    url: '/ydh/agentCommissionSettlement/getRunreadCount',
    method: 'post',
    data: qs.stringify(data),
  })
}



export {
  settleList,
  settleDetail,
  audit,
  settlePayUrl,
  adminCountSettle,
  confirmReceipt,
  updateRunread,
  getRunreadCount
}
