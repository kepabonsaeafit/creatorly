// Kevin Pabón

import './assets/main.css'
import 'vue-toastification/dist/index.css'

// external imports
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Toast, { POSITION } from 'vue-toastification'

// internal imports
import App from '@/App.vue'
import { initPinia } from '@/PiniaConfig'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
initPinia()
app.use(router)
app.use(Toast, { position: POSITION.BOTTOM_RIGHT, timeout: 3500 })

app.mount('#app')
