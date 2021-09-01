import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import dayjs from "dayjs";
import 'dayjs/locale/nl'
dayjs.locale('nl');

createApp(App).use(store).use(router).mount('#app')
