/// <reference types="vite/client" />

// Vite 8 的 vite/client 不再提供 *.vue 模块声明，此处补充以支持纯 TS 文件中导入 .vue 组件
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Vite 8 的 vite/client 也不再提供静态资源模块声明，导入后得到资源 URL
declare module "*.svg" {
  const src: string;
  export default src;
}
