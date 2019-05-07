import Vue from 'vue'
import Router from 'vue-router'
import Rods from '@/components/Rods'
import Rod from '@/components/Rod'
import RodGraph from '@/components/RodGraph'
import Tree from '@/components/Person/Tree'
import Profile from '@/components/Person/Profile'
import SearchPersons from '@/components/Person/SearchPersons'
import CreatePerson from '@/components/Person/CreatePerson'
import AddPerson from '@/components/Person/AddPerson'
import Signin from '@/components/User/Signin'
import Signup from '@/components/User/Signup'
import Stat from '@/components/Stat'
import notFound from '@/components/notFound'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/rod/all'
    },
    {
      path: '/rod/all',
      name: 'Rods',
      component: Rods
    },
    {
      path: '/rod/graph',
      name: 'RodGraph',
      component: RodGraph
    },
    {
      path: '/rod/:_key',
      name: 'Rod',
      component: Rod,
      props: true
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }, // todo: redirect на страницу user если уже signed in
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/profile/:key',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/person/find',
      name: 'SearchPersons',
      component: SearchPersons
    },
    {
      path: '/person/create',
      name: 'CreatePerson',
      component: CreatePerson
    }, // manager role only, todo: forbid for others
    {
      path: '/tree/:key',
      name: 'Tree',
      component: Tree
    },
    {
      path: '/person/:key/add/:reltype',
      name: 'AddPerson',
      component: AddPerson,
      props: true
    },
    {
      path: '/stat',
      component: Stat
    },
    {
      path: '*',
      component: notFound
    }
  ],
  mode: 'history'
})