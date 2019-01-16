import Vue from 'vue'

/**
 * ELEMENT UI
 */
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
// import 'element-ui/lib/theme-chalk/index.css'

/**
 * FONTAWESOME
 */
import fontawesome from '@fortawesome/fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

/**
 * QUILL EDITOR
 */
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import App from './App'
import router from './router'
import store from './store'

Vue.use(ElementUI, { locale })
Vue.use(VueQuillEditor)
Vue.component('icon', FontAwesomeIcon)

fontawesome.library.add(brands, solid, regular)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
