import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { seed } from './services/seed'

// Datos ficticios en LocalStorage solo en el primer arranque (ADR-0001).
seed()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
