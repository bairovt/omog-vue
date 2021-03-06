import Vue from 'vue'
import './plugins/vuetify'
import Croppa from 'vue-croppa'
import {
  store
} from './store/store'
import App from './App.vue'
import router from './router'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Alert from './components/Shared/Alert.vue'
import PersonsList from './components/Shared/PersonsList.vue'
import PersonFields from './components/Shared/PersonFields.vue'
import ImageUploadCroppa from './components/Shared/ImageUploadCroppa.vue'
import RightDrawer from './components/RightDrawer.vue'
import RelateDialogNew from './components/Person/RelateDialogNew.vue'
import {
  gender,
  rodName,
  fullestName
} from '@/filters'

Vue.use(Croppa)

Vue.component('app-alert', Alert)
Vue.component('persons-list', PersonsList)
Vue.component('person-fields', PersonFields)
Vue.component('image-upload-croppa', ImageUploadCroppa)
Vue.component('right-drawer', RightDrawer)
Vue.component('relate-dialog-new', RelateDialogNew)

Vue.filter('rodName', rodName)
Vue.filter('gender', gender)
Vue.filter('fullestName', fullestName)

// import '../node_modules/vuetify/src/stylus/app.styl'
import './stylus/main.styl'
import './stylus/theme.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('autoSingIn')
  }
})