import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(Vue3Toastify);

createApp(App).mount('#app')
