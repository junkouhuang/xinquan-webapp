import request from '@/plugin/axios'
import qs from 'qs'



// 获取药品列表
const getDrugList = data=> {
  return request ({
    url: '/ydh/drug/list',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 药品详情
const detailDrug = data=> {
  return request ({
    url: '/ydh/drug/detail',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 更新药品
const updateDrug = data=> {
  return request ({
    url: '/ydh/drug/update',
    method: 'post',
    data: qs.stringify(data),
  })
}



export {
  getDrugList,
  detailDrug,
  updateDrug
}
