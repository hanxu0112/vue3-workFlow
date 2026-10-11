<template>
  <div class="scene-flow-chart">
    <div id="container"></div>
    <div class="beauty-btn">
      <div class="menus-btn-group" v-show="showNodePanel">
        <div v-for="item in menuList" :key="item.shape">
          <div
            class="draggable-node"
            draggable="true"
            @mousedown="startDrag(item, $event)"
          >
            <span class="menu-box">
              <span class="icon-box">
                <img :src="getNodeIcon(item.shape)" alt />
              </span>
              &nbsp;&nbsp;{{ item.label }}
            </span>
          </div>
        </div>
      </div>
      <el-button
        size="small"
        type="plain"
        :icon="Plus"
        class="addNode-btn"
        @click="showNodePanel = !showNodePanel"
        >添加节点</el-button
      >
      <el-button
        size="small"
        type="plain"
        :icon="ZoomIn"
        class="tool-btn"
        :disabled="scale >= 1.6"
        @click="zoomIn()"
      ></el-button>
      <el-button
        size="small"
        type="plain"
        :icon="ZoomOut"
        class="tool-btn"
        :disabled="scale <= 0.4"
        @click="zoomOut()"
      ></el-button>
      <el-button
        size="small"
        type="plain"
        :icon="Expand"
        class="tool-btn"
        @click="beautyCanvasPosition()"
      ></el-button>
      <el-button
        size="small"
        type="plain"
        :icon="RefreshRight"
        class="tool-btn"
        @click="resetDemo()"
      ></el-button>
    </div>
    <nodeCommonDialog @save="onNodeFormSave" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
// x6 v3 已将 Dnd 等插件内置到核心包，@antv/x6-plugin-dnd 已废弃
import { Graph, Shape, Dnd, Selection } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Expand,
  RefreshRight,
} from "@element-plus/icons-vue";
import { menuList } from "@/views/canvasComponents/common/menuList";
import { registerCustomNodes } from "@/views/canvasComponents/common/registerNode";
import {
  ports,
  judgePorts,
  buildEdgeAttrs,
  edgeStrokeForPort,
} from "@/views/canvasComponents/common/nodeTools";
import deleteIcon from "@/assets/delete.svg";
import { useStore } from "vuex";
import nodeCommonDialog from "@/views/canvasComponents/canvasForm/nodeCommonDialog.vue";
import { demoNodes, demoEdges } from "@/views/canvasComponents/common/demoData";

// 悬浮删除按钮工具（自定义 icon，节点/连线共用）
const removeToolMarkup = [
  {
    tagName: "image",
    selector: "button",
    attrs: {
      x: -9,
      y: -9,
      width: 18,
      height: 18,
      cursor: "pointer",
      href: deleteIcon,
      "xlink:href": deleteIcon, // 兼容旧浏览器
    },
  },
];
const removeToolMarkupNode = [
  {
    tagName: "image",
    selector: "button",
    attrs: {
      x: -25,
      y: -9,
      width: 18,
      height: 18,
      cursor: "pointer",
      href: deleteIcon,
      "xlink:href": deleteIcon, // 兼容旧浏览器
    },
  },
];
// 点击删除：节点需连带删除关联连线
const removeCellHandler = ({ cell, view }: any) => {
  if (cell.isNode()) {
    view.graph.getConnectedEdges(cell).forEach((edge: any) => edge.remove());
  }
  cell.remove();
};
Graph.registerNodeTool("button-remove-image", {
  inherit: "button",
  markup: removeToolMarkupNode,
  onClick: removeCellHandler,
});
Graph.registerEdgeTool("button-remove-image", {
  inherit: "button",
  markup: removeToolMarkup,
  onClick: removeCellHandler,
});

// 预加载所有节点图标（Vite 不支持 require，需用 import.meta.glob 静态分析动态路径）
const iconModules = import.meta.glob("@/assets/canvasIcons/*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const getNodeIcon = (shape: string) =>
  iconModules[`/src/assets/canvasIcons/${shape}.svg`] ?? "";

onMounted(() => {
  createGraph();
});
// 流程图页面
const graph = ref<Graph | null>(null);
const dnd = ref<Dnd | null>(null); // 拖拽插件实例
const store = useStore(); // 全局状态（控制节点表单抽屉显隐与当前编辑节点）

// 画布数据持久化（localStorage）：刷新不丢，首次打开加载示例流程
const CANVAS_STORAGE_KEY = "flowChart:canvas";
let saveTimer: ReturnType<typeof setTimeout> | null = null;
const persistCanvas = () => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (graph.value) {
      try {
        localStorage.setItem(
          CANVAS_STORAGE_KEY,
          JSON.stringify(graph.value.toJSON())
        );
      } catch {
        // 存储失败（如配额超限）静默忽略
      }
    }
  }, 500);
};
// 加载画布：优先从 localStorage 恢复（保留上次位置），否则渲染示例并自动布局
const loadCanvas = () => {
  const g = graph.value;
  if (!g) return;
  const saved = localStorage.getItem(CANVAS_STORAGE_KEY);
  if (saved) {
    try {
      g.fromJSON(JSON.parse(saved));
      return; // 从本地存储恢复，保留上次位置，不重新布局
    } catch {
      // 数据损坏，回落到示例
    }
  }
  loadDemo();
};
// 渲染内置示例流程（开始→判断→大模型→代码→数据库→结束，判断 N 分支→MCP→结束）
const loadDemo = () => {
  const g = graph.value;
  if (!g) return;
  const ids = demoNodes.map((n, i) =>
    g.addNode({
      shape: n.shape,
      position: { x: i * 250 + 50, y: 100 },
      data: n.data,
    }).id
  );
  demoEdges.forEach((e) => {
    g.addEdge({
      shape: "edge",
      source: { cell: ids[e.from], port: e.port ?? "port2" },
      target: { cell: ids[e.to], port: "portIn" },
      attrs: buildEdgeAttrs({ stroke: edgeStrokeForPort(e.port) }),
      zIndex: -1,
    });
  });
  beautyCanvasPosition();
};
// 重置为示例（清空当前画布后重新加载）
const resetDemo = () => {
  graph.value?.clearCells();
  loadDemo();
};

/**
 * 闭环条件：从 target 出发沿出边方向已能到达 source。
 * BFS 遍历以 target 为起点的出边，若遇到 source 即判定为闭环。
 */
const wouldCreateCycle = (g: Graph, sourceId: string, target: any) => {
  const visited = new Set<string>();
  const queue: any[] = [target];
  while (queue.length) {
    const cur = queue.shift()!;
    const curId: string = cur.id;
    if (curId === sourceId) return true; // target 已能到达 source → 会形成闭环
    if (visited.has(curId)) continue;
    visited.add(curId);
    // 只跟随以 cur 为起点的出边，前往其目标节点
    g.getConnectedEdges(cur).forEach((edge: any) => {
      const sc = edge.getSourceCell();
      if (sc && sc.id === curId) {
        const next = edge.getTargetCell();
        if (next) queue.push(next);
      }
    });
  }
  return false;
};

const createGraph = () => {
  const container = document.getElementById("container");
  if (!container) return;
  registerCustomNodes(); // 注册自定义节点（需在创建节点前调用）
  const graphInstance = new Graph({
    container,
    width: container.scrollWidth,
    height: container.scrollHeight,
    grid: true,
    autoResize: true,
    panning: true, // 拖拽画布空白处平移
    mousewheel: {
      enabled: true, // 滚轮直接控制缩放，不再滚动页面
      factor: 1.1, // 单次滚动缩放系数
      minScale: 0.4, // 与缩小按钮禁用阈值一致
      maxScale: 1.6, // 与放大按钮禁用阈值一致
      zoomAtMousePosition: true, // 以鼠标位置为中心缩放
    },
    connecting: {
      snap: { radius: 50 }, // 拖动连接线时吸附到指定半径内最近的节点/连接桩
      allowBlank: false, // 不允许画布空白处创建连接线
      allowLoop: false, // 不允许节点自连
      highlight: true,
      // 连接校验：结束节点不能连出、开始节点不能连入、不允许形成闭环
      validateConnection: ({
        sourceCell,
        targetCell,
        sourceView,
        targetView,
      }) => {
        // 结束节点只能作为终点，不能作为起点
        if (sourceCell?.shape === "end") return false;
        // 开始节点只能作为起点，不能作为终点
        if (targetCell?.shape === "start") return false;
        // 防闭环：若 target 已能沿出边到达 source，则拒绝
        const g = sourceView?.graph ?? targetView?.graph;
        if (g && sourceCell && targetCell && sourceCell.id !== targetCell.id) {
          if (wouldCreateCycle(g, sourceCell.id, targetCell)) return false;
        }
        return true;
      },
      connector: {
        name: "smooth",
        args: {
          direction: "H", //  H | V 保持水平连接或者保持垂直连接
        },
      },
      allowPort: true,
      connectionPoint: "boundary",
      createEdge({ sourceView, sourceMagnet }) {
        // 按拖出的源端口着色：判断节点 portY 绿 / portN 红，其余默认色
        const portId = sourceView?.findAttr("port", sourceMagnet) ?? null;
        return new Shape.Edge({
          attrs: buildEdgeAttrs({ stroke: edgeStrokeForPort(portId) }),
          zIndex: -1,
        });
      },
    },
  });
  graph.value = graphInstance;
  graphInstance.on("scale", syncScale); // 缩放变化时同步 scale（滚轮、按钮缩放都会触发）
  // 节点拖放到画布后才挂载连接桩（拖拽预览时不显示）
  graphInstance.on("node:added", ({ node }) => {
    if (node.getPorts().length === 0) {
      // 判断节点使用双输出桩（Y 绿 / N 红），其余节点使用通用单输出桩
      node.prop("ports", node.shape === "judge" ? judgePorts : ports);
    }
  });
  // 点击节点：把节点快照写入 Vuex 并打开表单抽屉
  graphInstance.on("node:click", ({ node }) => {
    const data = node.getData() || {};
    store.commit("setCurrentNode", {
      id: node.id,
      shape: node.shape,
      name: data.name || "",
      description: data.description || "",
    });
    store.commit("setShowDrawer", true);
  });
  // 连线连接完成后按源端口动态着色（覆盖重连：源端口改变时颜色随之更新）
  graphInstance.on("edge:connected", ({ edge }) => {
    edge.attr("line/stroke", edgeStrokeForPort(edge.getSourcePortId()));
  });
  graphInstance.on("edge:mouseleave", ({ cell, edge, ...args }) => {
    cell.removeTools(); // 鼠标离开边时 删除所有工具
    edge.zIndex = 0;
  });
  // 连线悬浮：显示删除按钮，点击删除该连线
  graphInstance.on("edge:mouseenter", ({ edge }) => {
    if (edge.hasTools("button-remove-image")) return;
    edge.addTools({
      name: "button-remove-image",
      args: {
        distance: "50%", // 按钮显示在连线中点
      },
    });
  });
  // 节点悬浮：显示删除按钮，点击删除节点及其关联连线
  graphInstance.on("node:mouseenter", ({ node }) => {
    if (node.hasTools("button-remove-image")) return;
    node.addTools({
      name: "button-remove-image",
      args: {
        x: "100%",
        y: "50%", // 垂直居中于节点右侧边缘
        offset: { x: 0, y: 0 }, // 图标中心贴右边缘中点（markup 已居中）
      },
    });
  });
  graphInstance.on("node:mouseleave", ({ node }) => {
    node.removeTools();
  });
  // 选择插件：按住 Ctrl/Meta 拖拽空白处框选；单击选中；双击选中（先清空其余选中）
  graphInstance.use(
    new Selection({
      enabled: true,
      rubberband: true,
      modifiers: ["ctrl", "meta"], // 按住 Ctrl/Meta 才触发框选，否则拖拽空白处平移画布
      multiple: true,
      multipleSelectionModifiers: ["ctrl", "meta"],
      rubberEdge: true,
      showNodeSelectionBox: true,
      movable: true,
    })
  );
  graphInstance.on("node:dblclick", ({ node }) => {
    graphInstance.cleanSelection();
    graphInstance.select(node); 
  });
  graphInstance.on("edge:dblclick", ({ edge }) => {
    graphInstance.cleanSelection();
    graphInstance.select(edge);
  });
  // 画布数据持久化：节点/连线增删、位置与数据变化时防抖保存到 localStorage
  graphInstance.on("cell:added", persistCanvas);
  graphInstance.on("cell:removed", persistCanvas);
  graphInstance.on("cell:change:position", persistCanvas);
  graphInstance.on("cell:change:data", persistCanvas);
  dnd.value = new Dnd({ target: graphInstance }); // 初始化拖拽插件，绑定目标画布
  loadCanvas(); // 加载已保存画布或内置示例流程
};

const showNodePanel = ref(false); // 控制节点面板显示隐藏

const scale = ref(1); // 当前缩放比例（控制放大/缩小按钮禁用态）
const syncScale = () => {
  if (graph.value) scale.value = graph.value.zoom();
};
const zoomIn = () => {
  graph.value?.zoom(0.2); // 相对放大 0.2
  syncScale();
};
const zoomOut = () => {
  graph.value?.zoom(-0.2); // 相对缩小 0.2
  syncScale();
};
const beautyCanvasPosition = async () => {
  const g = graph.value;
  if (!g) return;
  // dagre 层次布局：@antv/layout v2 的 execute 为异步，执行后用 forEachNode 回读坐标
  const layout = new DagreLayout({
    rankdir: "LR", // 布局方向：从左到右
    align: undefined, // 节点在层内垂直居中对齐（UL/UR/DL/DR 为角对齐，undefined 为居中）
    nodesep: 10, // 同层节点间距
    ranksep: 80, // 层间距
    nodeSize: [200, 44], // 节点尺寸（宽×高），用于碰撞检测
  });
  // 将画布节点/边转为 @antv/layout 需要的 { nodes, edges } 数据
  const data = {
    nodes: g.getNodes().map((n) => ({ id: n.id })),
    edges: g
      .getEdges()
      .filter((e) => e.getSourceCellId() && e.getTargetCellId())
      .map((e) => ({
        id: e.id,
        source: e.getSourceCellId(),
        target: e.getTargetCellId(),
      })),
  };
  await layout.execute(data);
  // 布局起始偏移
  const offsetX = 50;
  const offsetY = 10;
  layout.forEachNode((node) => {
    const cell = g.getCellById(String(node.id));
    if (cell && cell.isNode()) {
      const { width: w, height: h } = cell.getSize();
      // dagre 的 x/y 是节点中心，X6 position 是左上角
      cell.position(node.x - w / 2 + offsetX, node.y - h / 2 + offsetY);
    }
  });
};

// 表单保存：把 name/description 写回节点 data（触发 change:data → 节点组件刷新展示），并关闭抽屉
const onNodeFormSave = (data: { name: string; description: string }) => {
  const cur = store.state.currentNode;
  if (cur && graph.value) {
    const cell = graph.value.getCellById(cur.id);
    if (cell && cell.isNode()) {
      // setData 默认深合并，保留 data 上其他字段
      cell.setData({ name: data.name, description: data.description });
    }
  }
  store.commit("setShowDrawer", false);
};

// 从左侧菜单拖拽节点到画布
const startDrag = (item: (typeof menuList)[number], event: MouseEvent) => {
  if (!graph.value || !dnd.value) return;
  const node = graph.value.createNode({
    shape: item.shape,
  });
  dnd.value.start(node, event);
};
</script>

<style lang="scss" scoped>
@use "./flowChart.scss";
</style>
