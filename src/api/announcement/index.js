import request from '@/plugin/axios'
import qs from 'qs'

// 获取供应商列表
const getEnterpriseList = data=> {
  return request ({
    url: '/ydh/announcement/supplierShow',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 新增公告
const addAnnouncementList = data=> {
  return request ({
    url: '/ydh/announcement/add',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 获取公告列表
const getAnnouncementList = data=> {
  return request ({
    url: '/ydh/announcement/list',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 公告详情
const detailAnnouncement = data=> {
  return request ({
    url: '/ydh/announcement/preview',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 公告编辑
const editorAnnouncement = data=> {
  return request ({
    url: '/ydh/announcement/update',
    method: 'post',
    data: qs.stringify(data),
  })
}
// 公告删除
const deleteAnnouncement = data=> {
  return request ({
    url: '/ydh/announcement/delete',
    method: 'post',
    data: data,
  })
}
//启用/禁止公告
const updateStatus = data=> {
  return request ({
    url: '/ydh/announcement/updateStatus',
    method: 'post',
    data: qs.stringify(data),
  })
}


export {
	getEnterpriseList,
  getAnnouncementList,
  detailAnnouncement,
  editorAnnouncement,
  addAnnouncementList,
  deleteAnnouncement,
  updateStatus
}
