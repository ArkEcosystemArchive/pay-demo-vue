import Vue from 'vue'
import VueClipboards from 'vue-clipboards'
import VueQrcode from '@xkeshi/vue-qrcode'

Vue.use(VueClipboards)

Vue.component(VueQrcode.name, VueQrcode)
Vue.component('example-component', require('./components/ExampleComponent.vue'))

new Vue({
    el: '#app'
})
