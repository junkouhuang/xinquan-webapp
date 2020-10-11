import request from '@/plugin/axios'

// 获取卡券列表
function getCardList(data) {
  return request ({
    url: '/edu/couponParent/query',
    method: 'get',
    params: data
  })
}

// 获取机构的卡券
function getOrgCardList(id) {
  return request ({
    url: '/edu/couponParent/choice',
    params: { organizationId: id }
  })
}

// 添加卡券
function addCard(data) {
  return request ({
    url: '/edu/couponParent/add',
    method: 'post',
    headers: { 'loading': 1 },
    data
  })
}

// 更新卡券
function updateCard(data) {
  return request ({
    url: '/edu/couponParent/edit',
    method: 'post',
    headers: { 'loading': 1 },
    data
  })
}

// 获取卡券详情
function getCardDetail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/couponParent/detail',
    method: 'post',
    data: formData
  })
}

// 删除卡券
function deleteCards(ids) {
  let formData = new FormData()
  formData.append('cardParentIds', ids)
  return request ({
    url: '/edu/couponParent/deleteBatch',
    method: 'post',
    data: formData
  })
}

// 添加子卡券
function addCardCoupon(data) {
  return request ({
    url: '/edu/cardCoupon/add',
    method: 'post',
    data
  })
}

// 获取子卡券
function getCouponList(data) {
  return request ({
    url: '/edu/cardCoupon/query',
    method: 'get',
    params: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除子卡券
function deleteCoupon(ids) {
  let formData = new FormData()
  formData.append('cardIds', ids)
  return request ({
    url: '/edu/cardCoupon/deleteBatch',
    method: 'post',
    data: formData
  })
}

// 发布卡券
function releaseCoupon(data) {
  return request ({
    url: '/edu/cardDetails/publish/cardDetail',
    method: 'post',
    data
  })
}

// 发送卡券
function sendCoupon(data) {
  return request ({
    url: '/edu/cardDetails/send/cardNo',
    method: 'post',
    data
  })
}

// 重发短信
function sendSms(data) {
  let formData = new FormData()
  formData.append('cardDetailsId', data.cardDetailsId)
  formData.append('dwz', data.dwz)
  formData.append('phoneNumber', data.phoneNumber)
  return request ({
    url: '/edu/cardDetails/again/send/sms',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 创建短链
function createDwz(data) {
  let formData = new FormData()
  formData.append('id', data.id)
  formData.append('cardNo', data.cardNo)
  return request ({
    url: '/edu/cardCoupon/dwz/create',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export {
  getCardList,
  getOrgCardList,
  addCard,
  updateCard,
  getCardDetail,
  deleteCards,
  addCardCoupon,
  getCouponList,
  deleteCoupon,
  releaseCoupon,
  sendCoupon,
  sendSms,
  createDwz
}
