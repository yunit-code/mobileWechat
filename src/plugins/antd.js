// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue';
import 'ant-design-vue/lib/tabs/style/css';
import 'ant-design-vue/lib/modal/style/css';
import {
  Tabs,
  Modal
} from 'ant-design-vue';

/* v1.1.3+ registration methods */
Vue.use(Tabs);
Vue.use(Modal);