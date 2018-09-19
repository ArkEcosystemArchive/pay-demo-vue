import Vue from 'vue'
import VueClipboards from 'vue-clipboards'
Vue.use(VueClipboards)

Vue.component('example-component', require('./components/ExampleComponent.vue'))

new Vue({
    el: '#app'
})
