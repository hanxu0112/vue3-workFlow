# Vue3 TS App · 任务流程编排系统
运行试试：https://hanxu0112.github.io/vue3-workFlow

基于 **Vue 3 + TypeScript** 实现的可视化**任务流程编排系统**，以 AntV X6 图编辑引擎为核心，支持拖拽编排节点、连线驱动、节点配置抽屉、自动层次布局等能力。原始场景面向**智能诊断**等业务范畴，其节点模型（开始 / 判断 / 大语言模型 / 代码 / MCP 插件 / 数据库 / 结束）通用且可扩展，可广泛应用于 Agent 工作流编排、车联网诊断、数据处理流水线、审批流等业务场景。

> 版本：`v0.0.0`（见 `package.json`）

## 功能特性

- **可视化流程编排**：拖拽节点入画布、连线驱动流程、悬停删除、双击选中、框选。
- **7 类内置节点**：开始、判断（双输出 Y/N）、文本大模型、代码、MCP 插件、数据库、结束。
- **判断节点双分支**：绿色 Y / 红色 N 两个输出连接桩，连线颜色随源端口动态着色。
- **节点配置抽屉**：点击节点打开右侧抽屉，填写节点名称 / 描述并保存，描述实时回显到节点上。
- **自动层次布局**：基于 @antv/layout 的 Dagre 层次布局，一键整理画布，节点层内垂直居中。
- **全局状态管控**：Vuex 管理抽屉显隐与当前编辑节点，便于跨组件控制。
- **多环境支持**：SIT / UAT / 生产三套环境配置与构建脚本。
- **工程化**：Element Plus 组件按需自动导入、路径别名、API 代理、TypeScript 严格检查。

## 技术栈

| 分类 | 技术 | 版本 |
| --- | --- | --- |
| 核心框架 | Vue | `^3.5.39`（`<script setup>` SFC） |
| 语言 | TypeScript | `~6.0.2` |
| 构建工具 | Vite | `^8.1.1` |
| UI 组件库 | Element Plus + @element-plus/icons-vue | `^2.14.4` / `^2.3.2` |
| 图编辑引擎 | @antv/x6 + @antv/x6-vue-shape | `^3.1.8` / `^3.0.2` |
| 自动布局 | @antv/layout（Dagre 层次布局） | `^2.0.0` |
| 路由 | vue-router | `^5.2.0` |
| 状态管理 | Vuex | `^4.1.0` |
| 自动导入 | unplugin-auto-import / unplugin-vue-components | `^21.1.0` / `^32.1.0` |
| 样式 | Sass | `^1.102.0` |

---

## 项目结构

```
vue3-ts-app/
├── src/
│   ├── api/                          # 接口封装（如 getCanvsa.api 画布数据接口）
│   ├── assets/                       # 静态资源（节点图标 canvasIcons/ 等）
│   ├── components/                   # 通用组件
│   ├── router/
│   │   └── index.ts                 # 路由配置入口
│   ├── store/
│   │   └── index.ts                  # Vuex 全局状态（节点配置抽屉显隐 / 当前编辑节点）
│   ├── views/
│   │   ├── Home.vue                  # 介绍页
│   │   ├── flowChart.vue             # 流程编排主页面（画布、工具栏、抽屉挂载）
│   │   ├── flowChart.scss            # 流程页样式
│   │   ├── system/                   # 系统管理（Roles.vue / Users.vue）
│   │   └── canvasComponents/         # 画布相关
│   │       ├── common/               # menuList.ts / registerNode.ts / nodeTools.ts（连接桩与连线样式）
│   │       ├── customNodes/          # 7 类节点组件 + useNodeData.ts（节点数据响应式桥接）
│   │       │   └── css/nodeStyle.scss
│   │       └── canvasForm/            # 节点配置表单 + nodeCommonDialog.vue（抽屉容器）
│   ├── App.vue
│   ├── main.ts                       # 应用入口（注册 router / store）
│   └── style.css
├── .env / .env.sit / .env.uat / .env.production   # 多环境变量
├── vite.config.ts                    # Vite 配置（别名 / 代理 / 自动导入）
├── tsconfig*.json                    # TypeScript 配置
└── package.json
```

---

## 路由

路由配置文件：**`src/router/index.ts`**

| 路径 | name | 组件 | 说明 |
| --- | --- | --- | --- |
| `/` | `home` | `views/Home.vue` | 首页 |
| `/scene-flow-chart` | `flowChart` | `views/flowChart.vue` | 流程编排画布 |

采用 `createWebHistory`（HTML5 History 模式）。新增页面在此文件的 `routes` 数组中追加路由记录即可。

---

## 快速开始

### 环境要求

- **Node.js**：`>= 20.19`（推荐 `22.x` LTS）
  > Vite 8 要求 Node 20.19+ 或 22.12+；`@types/node` 已升至 v24，建议使用当前 LTS。
- **包管理器**：npm（与 `package-lock.json` 配套），亦可使用 pnpm / yarn。
- **编辑器**：VS Code + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（Vue 官方语言支持，正确识别 `.vue` / `import.meta.glob` 等类型）。

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

### 构建与预览

```bash
# 类型检查
npm run type:check

# 各环境构建
npm run build:sit     # SIT 环境
npm run build:uat     # UAT 环境
npm run build:prod    # 生产环境

# 本地预览构建产物
npm run preview
```

---

## 环境与构建配置

### 多环境变量

| 文件 | 用途 | 关键变量 |
| --- | --- | --- |
| `.env` | 所有环境共享基础配置 | `VITE_APP_TITLE` |
| `.env.sit` | SIT（系统集成测试） | `VITE_APP_TITLE` / `VITE_API_BASE_URL` |
| `.env.uat` | UAT（用户验收测试） | `VITE_APP_TITLE` / `VITE_API_BASE_URL` |
| `.env.production` | 生产环境 | `VITE_APP_TITLE` / `VITE_API_BASE_URL` |

代码中通过 `import.meta.env.VITE_APP_TITLE` / `VITE_API_BASE_URL` 访问。

### Vite 配置要点（`vite.config.ts`）

- **路径别名**：`@` → `./src`。
- **API 代理**：`/api` 代理至 `http://localhost:3000`，并去除 `/api` 前缀。
- **自动导入**：`unplugin-auto-import` + `unplugin-vue-components` 配合 `ElementPlusResolver`，Element Plus 组件 / 图标按需自动注册，无需手动 import。
- **运行时定义**：`define: { 'process.env': {} }`，兼容部分依赖对 `process.env` 的引用。

### TypeScript 配置

- `tsconfig.json` 引用 `tsconfig.app.json`（应用代码）与 `tsconfig.node.json`（Node 侧）。
- `tsconfig.app.json` 继承 `@vue/tsconfig/tsconfig.dom.json`，开启 `noUnusedLocals` / `noUnusedParameters` 等严格选项。
- 路径映射：`@/*` → `./src/*`；并补充 `vuex` → `./node_modules/vuex/types/index.d.ts`（vuex 4 的 `exports` 未暴露 `types`，此处显式指向其类型声明）。
- `src/vite-env.d.ts` 补充了 `*.vue` 与 `*.svg` 模块声明（Vite 8 的 `vite/client` 不再提供）。

---

## 核心机制说明

### 节点模型

每个节点 = **shape 名** + **Vue 组件** + **图标** + **配置表单**，四处用同一 shape 名串联：

- 节点组件目录：`src/views/canvasComponents/customNodes/`
- 图标目录：`src/assets/canvasIcons/`
- 注册与菜单：`common/menuList.ts`、`common/registerNode.ts`
- 配置表单：`canvasForm/{shape}Form.vue`

### 连接桩与连线（`common/nodeTools.ts`）

- 通用节点：左侧输入桩 + 右侧单输出桩。
- 判断节点：左侧输入桩 + 右侧双输出桩（`portY` 绿 / `portN` 红，桩旁标注 Y/N）。
- 连线颜色随源端口动态着色：拖线时按源端口取色，重连时按新源端口刷新（`edge:connected`）。

### 节点配置抽屉（Vuex 驱动）

1. 点击节点 → `flowChart.vue` 把节点快照 `{id, shape, name, description}` 写入 Vuex 并打开抽屉；
2. `nodeCommonDialog.vue` 按节点 shape 从 `FORM_MAP` 取对应表单，并把已有 `name/description` 作为 props 预填；
3. 表单保存 → `cell.setData({name, description})` 写回节点 data（默认深合并）；
4. 节点组件通过 `useNodeData` 监听 `change:data` 事件，把 `description` 同步到 ref 实现响应式回显（`node.data` 是 X6 内部对象、非 Vue 响应式，需事件桥接）。

### 自动布局

`flowChart.vue` 的 `beautyCanvasPosition` 使用 `@antv/layout` 的 `DagreLayout`（`rankdir: "LR"`，`align: undefined` 层内垂直居中），一键将画布节点 / 边转为层次布局并回写坐标。

---

## 说明

- `.env.*` 中的 `VITE_API_BASE_URL` 为示例地址，接入实际后端时请替换。
- `src/api/getCanvsa.api` 为画布数据接口预留位置，按后端契约补全。
- `src/views/system/`（Roles / Users）为系统管理预留页面，可按需接入路由。


设计模式归类总结
