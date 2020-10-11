import layout from '@/components/layout'
import cardIndex from '@/views/card/Index.vue'
import cardAdd from '@/views/card/Add.vue'
import cardEdit from '@/views/card/Edit.vue'
import cardList from '@/views/card/List.vue'
import cardDetail from '@/views/card/Detail.vue'
import cardRelease from '@/views/card/Release.vue'
import cardSend from '@/views/card/Send.vue'

export default {
  path: '/card',
  name: 'card',
  component: layout,
  redirect: { name: 'card-index' },
  children: [
    {
      path: 'index',
      name: 'card-index',
      component: cardIndex
    },
    {
      path: 'add',
      name: 'card-add',
      component: cardAdd
    },
    {
      path: 'list',
      name: 'card-list',
      component: cardList
    },
    {
      path: 'release',
      name: 'card-release',
      component: cardRelease
    },
    {
      path: 'send',
      name: 'card-send',
      component: cardSend
    },
    {
      path: ':id',
      name: 'card-edit',
      component: cardEdit
    },
    {
      path: ':id/list',
      name: 'card-detail',
      component: cardDetail
    }
  ]
}
