import request from '@/plugin/axios'

function getCenterList(data) {
  return request ({
    url: '/edu/center/query',
    params: data
  })
}

function getCenterDetail(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/center/detail',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

function addCenter(data) {
  return request ({
    url: '/edu/center/add',
    method: 'post',
    data
  })
}

function updateCenter(data) {
  return request ({
    url: '/edu/center/update',
    method: 'post',
    data
  })
}

function deleteCenter(id) {
  let formData = new FormData()
  formData.append('id', id)
  return request ({
    url: '/edu/center/delete',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

export {
  getCenterList,
  getCenterDetail,
  addCenter,
  updateCenter,
  deleteCenter
}
