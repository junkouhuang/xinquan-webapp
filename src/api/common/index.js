import request from '@/plugin/axios'

function getAccountResource() {
  return request ({
    url: '/authorizes/account/resource',
    method: 'post'
  })
}

export { getAccountResource }
