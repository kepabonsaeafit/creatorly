// Author: Kevin Pabón

import './assets/main.css'
import 'vue-toastification/dist/index.css'

// external imports
import { createApp } from 'vue'
import Toast, { POSITION } from 'vue-toastification'

// internal imports
import App from '@/App.vue'
import PiniaConfig from '@/PiniaConfig'
import router from '@/router'
import { AuthService } from '@/services/AuthService'

const app = createApp(App)

app.use(PiniaConfig.init())
app.use(router)
app.use(Toast, { position: POSITION.BOTTOM_RIGHT, timeout: 3500 })

// Wired here and not inside AuthService so the service does not have to import
// the router: an expired token sends the user back to the login view.
AuthService.handleUnauthorized(() => {
  router.push({ name: 'login' })
})

app.mount('#app')
