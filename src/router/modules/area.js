import layout from '@/components/layout'
import areaIndex from '@/views/area/District.vue'
import cityIndex from '@/views/area/City.vue'
import countryIndex from '@/views/area/Country.vue'
import provinceIndex from '@/views/area/Province.vue'

export default {
  path: '/area',
  name: 'area',
  component: layout,
  redirect: { name: 'area-index' },
  meta:{
    title:'区域管理'
  },
  children: [
    {
      path: 'area',
      name: 'area-index',
      component: areaIndex,
      meta:{
        title:'区县管理'
      }
    },
    {
      path: 'city',
      name: 'city-index',
      component: cityIndex,
      meta:{
        title:'城市管理'
      }
    },
    {
      path: 'country',
      name: 'country-index',
      component: countryIndex,
      meta:{
        title:'国家管理'
      }
    },
    {
      path: 'province',
      name: 'province-index',
      component: provinceIndex,
      meta:{
        title:'省份管理'
      }
    }
  ]
}
