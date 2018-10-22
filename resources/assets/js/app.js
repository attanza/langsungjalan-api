import Vue from "vue"
import Vuetify from "vuetify"
import DefaultLayout from "./components/Layout"

window.Vue = Vue
Vue.use(Vuetify)
const app = new Vue({ //eslint-disable-line
  el: "#app",
  components: {
    DefaultLayout
  }
})
