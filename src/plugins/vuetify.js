import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import ru from 'vuetify/es5/locale/ru'

// todo: check if alacarte is enabled

// import {
//   VApp,
//   VNavigationDrawer,
//   VFooter,
//   VList,
//   VDivider,
//   VBtn,
//   VIcon,
//   VGrid,
//   VToolbar,
//   VTextField,
//   VSelect,
//   VRadioGroup,
//   VSwitch,
//   VCheckbox,
//   VAlert,
//   VAvatar,
//   transitions,
//   VDialog,
//   VCard,
//   VProgressCircular,
//   VSubheader,
//   VForm
// } from 'vuetify'

Vue.use(Vuetify, {
  iconfont: 'md',
  lang: {
    locales: {
      ru
    },
    current: 'ru'
  },
  // components: {
  //   VApp,
  //   VNavigationDrawer,
  //   VFooter,
  //   VList,
  //   VDivider,
  //   VBtn,
  //   VIcon,
  //   VGrid,
  //   VToolbar,
  //   VTextField,
  //   VSelect,
  //   VRadioGroup,
  //   VSwitch,
  //   VCheckbox,
  //   VAlert,
  //   VAvatar,
  //   transitions,
  //   VDialog,
  //   VCard,
  //   VProgressCircular,
  //   VSubheader,
  //   VForm,
  // },
  theme: {
    // primary: '#2b7ce9', //'#3f51b5'
    // secondary: '#b0bec5',
    // accent: '#8c9eff',
    // error: '#b71c1c',
    // success: '#147A4A'
  },
})