import layout from '@/components/layout'
import domain from '@/views/url/domain'
import short from '@/views/url/short'
import dwz from '@/views/url/dwz'

export default {
  path: '/url',
  name: 'url',
  component: layout,
  redirect: { name: 'url-domain' },
  meta:{
    title:'短网址管理'
  },
  children: [
    {
      path: 'domain',
      name: 'url-domain',
      component: domain,
      meta:{
        title:'域名管理'
      },
    },
    {
      path: 'short',
      name: 'url-short',
      component: short,
      meta:{
        title:'短网址列表'
      },
    },
    {
      path: 'dwz',
      name: 'url-dwz',
      component: dwz,
      meta:{
        title:'短网址解析'
      },
    }
  ]
}
