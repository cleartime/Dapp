import Vue from 'vue'
import Router from 'vue-router'
import Me from './views/Me.vue'
import Seting from './views/Seting.vue'
import Detail from './views/Detail.vue'
import Friends from './views/Friends.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'me',
      component: Me,
        children:[{
          path: '',
          name: 'detail',
          component: Detail
        }]
    },
      {
          path: '/friends',
          name: 'friends',
          component: Friends,
          children:[{
              path: '',
              name: 'detail',
              component: Detail
          }]
      },
    {
      path: '/seting',
      name: 'seting',
      component: Seting,
        children:[{
            path: '',
            name: 'detail',
            component: Detail
        }]
    },
  ]
})
