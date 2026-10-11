import type { Component } from "vue";
import { register } from "@antv/x6-vue-shape";
// 引入自定义节点组件
import start from "@/views/canvasComponents/customNodes/start.vue";
import judge from "@/views/canvasComponents/customNodes/judge.vue";
import llm from "@/views/canvasComponents/customNodes/llm.vue";
import code from "@/views/canvasComponents/customNodes/code.vue";
import mcp from "@/views/canvasComponents/customNodes/mcp.vue";
import db from "@/views/canvasComponents/customNodes/db.vue";
import end from "@/views/canvasComponents/customNodes/end.vue";

/** 自定义节点注册配置（连接桩在节点拖入画布后再挂载，见 flowChart.vue 的 node:added） */
interface CustomNodeConfig {
  shape: string;
  component: Component;
}

/** 节点统一尺寸 */
const NODE_SIZE = { width: 200, height: 44 } as const;

/** 自定义节点列表 */
const customNodes: CustomNodeConfig[] = [
  { shape: "start", component: start },
  { shape: "judge", component: judge },
  { shape: "llm", component: llm },
  { shape: "code", component: code },
  { shape: "mcp", component: mcp },
  { shape: "db", component: db },
  { shape: "end", component: end },
];

// 注册节点(当鼠标按下，拖动节点时，会注册一个节点)
export function registerCustomNodes(): void {
  customNodes.forEach(({ shape, component }) => {
    register({
      shape,
      ...NODE_SIZE,
      component,
      interactive: true,
    });
  });
}
