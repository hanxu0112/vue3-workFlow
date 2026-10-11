/**
 * 内置示例流程数据：首次打开（本地无保存数据）时自动渲染，
 * 配合 flowChart.vue 的 loadDemo 加载并自动布局，方便一眼看出编排效果。
 *
 * 节点用数组下标引用（demoEdges 的 from/to 即 demoNodes 下标）。
 */

export interface DemoNode {
  shape: string;
  data: { name: string; description: string };
}

export interface DemoEdge {
  /** 源节点在 demoNodes 中的下标 */
  from: number;
  /** 目标节点在 demoNodes 中的下标 */
  to: number;
  /** 源端口 id：判断节点用 portY(绿)/portN(红)，通用节点默认 port2 */
  port?: string;
}

/** 示例节点：开始 → 判断 → 大模型 → 代码 → 数据库 → MCP → 结束 */
export const demoNodes: DemoNode[] = [
  { shape: "start", data: { name: "开始", description: "流程起点，初始化诊断上下文" } },
  { shape: "judge", data: { name: "条件判断", description: "判断走自动推理还是兜底流程" } },
  { shape: "llm", data: { name: "大模型推理", description: "调用 LLM 分析诊断结论" } },
  { shape: "code", data: { name: "执行脚本", description: "运行诊断代码处理采集数据" } },
  { shape: "db", data: { name: "查询数据库", description: "检索历史诊断与车型库记录" } },
  { shape: "mcp", data: { name: "MCP工具", description: "兜底调用外部诊断插件" } },
  { shape: "end", data: { name: "结束", description: "输出诊断结果并归档" } },
];

/** 示例连线：判断节点 Y 分支走大模型主线、N 分支兜底走 MCP */
export const demoEdges: DemoEdge[] = [
  { from: 0, to: 1 }, // 开始 → 判断
  { from: 1, to: 2, port: "portY" }, // 判断(Y) → 大模型（绿线）
  { from: 1, to: 5, port: "portN" }, // 判断(N) → MCP（红线）
  { from: 2, to: 3 }, // 大模型 → 代码
  { from: 3, to: 4 }, // 代码 → 数据库
  { from: 4, to: 6 }, // 数据库 → 结束
  { from: 5, to: 6 }, // MCP → 结束
];
