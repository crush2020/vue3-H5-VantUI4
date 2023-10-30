import { createApp } from 'vue';
import App from './App.vue';
import { i18n } from '@/i18n';
import router from '@/router';
import store from '@/store';
import './assets/app.css';
import 'vant/es/notify/style';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { Permission } from '@/utils/permission.js';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 路由
app.use(router);

// 国际化
app.use(i18n);

// 状态管理
app.use(store);
app.use(Permission);

app.mount('#app');
