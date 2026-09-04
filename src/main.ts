// Kevin Pabón

import './assets/main.css'

// external imports
import { createPinia } from 'pinia'
import { createApp } from 'vue'

// internal imports
import App from '@/App.vue'
import { initPinia } from '@/PiniaConfig'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
initPinia()
app.use(router)

app.mount('#app')
