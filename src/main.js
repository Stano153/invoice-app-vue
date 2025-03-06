import './assets/main.css'

import { createApp } from 'vue'
import VueApexCharts from "vue3-apexcharts";
import App from './App.vue'
import store from './store/index.js'
import router from './router/index.js'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)
store.dispatch('tryLogin');
app.use(VueApexCharts);
app.use(router)
app.use(store)
app.use(Toast);
app.mount('#app')
