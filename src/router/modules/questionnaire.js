import layout from '@/components/layout'

import HeaderIndex from '@/views/questionnaire/header/Index.vue'
import HeaderAdd from '@/views/questionnaire/header/Add.vue'
import HeaderEdit from '@/views/questionnaire/header/Edit.vue'

import TopicIndex from '@/views/questionnaire/topic/Index.vue'
import TopicAdd from '@/views/questionnaire/topic/Add.vue'
import TopicEdit from '@/views/questionnaire/topic/Edit.vue'

import ItemIndex from '@/views/questionnaire/item/Index.vue'

import FeedBackIndex from '@/views/questionnaire/feedback/Index.vue'

export default {
  path: '/questionnaire',
  name: 'questionnaire',
  component: layout,
  redirect: { name: 'questionnaire-header' },
  children: [
    // 表头
    {
      path: 'header',
      name: 'questionnaire-header',
      component: HeaderIndex
    },
    {
      path: 'header/add',
      name: 'questionnaire-add',
      component: HeaderAdd
    },
    {
      path: 'header/:id',
      name: 'questionnaire-edit',
      component: HeaderEdit
    },
    // 问题
    {
      path: 'topic',
      name: 'questionnaire-topic',
      component: TopicIndex
    },
    {
      path: 'topic/add',
      name: 'questionnaire-add',
      component: TopicAdd
    },
    {
      path: 'topic/:id',
      name: 'questionnaire-edit',
      component: TopicEdit
    },
    // 题项
    {
      path: 'topic-item',
      name: 'questionnaire-topic-item',
      component: ItemIndex
    },
    // 反馈
    {
      path: 'feedback',
      name: 'questionnaire-feedback',
      component: FeedBackIndex
    }
  ]
}
