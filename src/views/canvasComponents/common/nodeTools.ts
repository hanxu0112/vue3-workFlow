// 封装节点工具：提供左右连接桩，连线，以及连线的样式
// 1. 定制连接桩
export const ports = {
  groups: {
    in: {
      position: {
        name: "left"
      },
      // 连接桩结构，selector 需与 attrs 中的键名一致，否则样式不生效
      markup: [{ tagName: "circle", selector: "portBody" }],
      attrs: {
        portBody: {
          // passive：可作为连线落点，但不能从它拖出连线（改为 false 会导致连不上）
          magnet: "passive",
          r: 4,
          stroke: "#5F95FF",
          fill: "#fff",
          strokeWidth: 1
        }
      }
    },
    out: {
      position: {
        name: "right"
      },
      markup: [{ tagName: "circle", selector: "portBody" }],
      attrs: {
        portBody: {
          magnet: true, // 出口桩可拖出连线
          r: 4,
          fill: "#fff",
          stroke: "#5F95FF",
          strokeWidth: 1
        }
      }
    }
  },
  items: [
    {
      id: "portIn",
      group: "in"
    },
    {
      id: "port2",
      group: "out"
    }
  ]
};

/** 判断节点输出端口颜色：Y 绿 / N 红 */
export const PORT_COLORS = {
  Y: "#90E19A",
  N: "#ff4d4f", // 红色
} as const;

/**
 * 判断节点连接桩：1 个输入 + 2 个输出（portY 绿 / portN 红），
 * 输出桩右侧标注 Y / N，连线颜色随源端口动态着色（见 edgeStrokeForPort）。
 */
export const judgePorts = {
  groups: {
    in: {
      position: { name: "left" },
      markup: [{ tagName: "circle", selector: "portBody" }],
      attrs: {
        portBody: {
          // passive：可作为连线落点，但不能从它拖出连线
          magnet: "passive",
          r: 4,
          fill: "#fff",
          stroke: "#5F95FF",
          strokeWidth: 1,
        },
      },
    },
    out: {
      position: { name: "right" },
      // 输出桩 = 圆点 + 右侧文本标签（Y/N）
      markup: [
        { tagName: "circle", selector: "portBody" },
        { tagName: "text", selector: "portLabel" },
      ],
      attrs: {
        portBody: {
          magnet: true, // 出口桩可拖出连线
          r: 4,
          fill: "#fff",
          stroke: "#5F95FF",
          strokeWidth: 1,
        },
        portLabel: {
          x: 12, // 标签在圆点右侧（节点边缘外）
          y: 0,
          "dominant-baseline": "central",
          "text-anchor": "start",
          "font-size": 12,
          "font-weight": 700,
        },
      },
    },
  },
  items: [
    { id: "portIn", group: "in" },
    {
      id: "portY",
      group: "out",
      attrs: {
        portBody: { fill: "#fff", stroke: PORT_COLORS.Y },
        portLabel: { text: "Y", fill: PORT_COLORS.Y },
      },
    },
    {
      id: "portN",
      group: "out",
      attrs: {
        portBody: { fill: "#fff", stroke: PORT_COLORS.N },
        portLabel: { text: "N", fill: PORT_COLORS.N },
      },
    },
  ],
};

// 2. 连线样式配置（在此统一修改颜色/宽度/箭头）
export const EDGE_STYLE = {
  stroke: "#BCC9DA", // 连线颜色
  strokeWidth: 1, // 连线宽度
  // 终点箭头，不需要可删除
  targetMarker: {
    name: "block",
    width: 12,
    height: 8
  }
};

/** 生成连线 attrs（可传入覆盖项，如 { stroke: "#f00" }） */
export const buildEdgeAttrs = (overrides: Partial<typeof EDGE_STYLE> = {}) => ({
  line: {
    ...EDGE_STYLE,
    ...overrides
  }
});

/** 根据源端口返回连线颜色：判断节点 portY 绿 / portN 红，其余用默认色 */
export const edgeStrokeForPort = (
  portId: string | null | undefined
): string => {
  if (portId === "portY") return PORT_COLORS.Y;
  if (portId === "portN") return PORT_COLORS.N;
  return EDGE_STYLE.stroke;
};

export const addTools = {

}