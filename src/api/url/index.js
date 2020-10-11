import request from '@/plugin/axios'

// 获取所有域名
export function getAllDomainList() {
  return request ({
    url: '/dwz/domain/list',
    params: {}
  })
}

// 获取域名列表
export function getDomainList(data) {
  let formData = new FormData()
  formData.append('domain', data.domain)
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  return request ({
    url: '/dwz/domain/query',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除域名
export function deleteDomain(id) {
  return request ({
    url: '/dwz/domain/delete',
    params: { code: id }
  })
}

// 添加域名
export function addDomain(data) {
  let formData = new FormData()
  data.domain && formData.append('domain', data.domain)
  data.remark && formData.append('remark', data.remark)
  return request ({
    url: '/dwz/domain/create',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取短网址列表
export function getShortUrlList(data) {
  let formData = new FormData()
  formData.append('pageNum', data.pageNum)
  formData.append('pageSize', data.pageSize)
  formData.append('dwz', data.dwz)
  formData.append('url', data.url)
  formData.append('code', data.code)
  return request ({
    url: '/dwz/query',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除短网址
export function deleteShortUrl(codes) {
  let formData = new FormData()
  formData.append('codes', codes)
  return request ({
    url: '/dwz/delete',
    method: 'post',
    data: formData
  })
}

// 添加短网址
export function addShortUrl(data) {
  let formData = new FormData()
  formData.append('source', data.source)
  formData.append('domainId', data.domainId)
  formData.append('remark', data.remark)
  return request ({
    url: '/dwz/cloud/create',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取短网址详情
export function getShortUrl(code) {
  return request ({
    url: '/dwz/edit',
    params: { code }
  })
}

// 更新短网址
export function updateShortUrl(data) {
  let formData = new FormData()
  formData.append('code', data.code)
  formData.append('url', data.url)
  return request ({
    url: '/dwz/save',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 导出短网址数据
export function exportsData() {
  return request ({
    url: '/dwz/reports/exports',
    method: 'get',
    params: {},
    responseType: 'arraybuffer'
  })
}

// 解析短网址
export function dwzResolve(url) {
  let formData = new FormData()
  formData.append('dwz', url)
  return request ({
    url: '/dwz/restore',
    method: 'post',
    data: formData
  })
}

export function createDwzQrcode(code) {
  return request ({
    url: '/dwz/qrcode/create',
    params: { code }
  })
}
