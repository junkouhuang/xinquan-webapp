import request from '@/plugin/axios'
import qs from 'qs'



// 获取账单列表
const getBillList = data=> {
  return request ({
    url: '/ydh/walletBills/getBillList',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 药品详情
const getBillDetails = data=> {
  return request ({
    url: '/ydh/walletBills/getBillDetails',
    method: 'post',
    data: qs.stringify(data),
  })
}





export {
  getBillList,
  getBillDetails
}
