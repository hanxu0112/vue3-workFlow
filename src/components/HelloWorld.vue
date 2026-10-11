<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="flow-doc">
    <!-- 顶部概览 -->
    <header class="doc-header">
      <h1>任务流程编排系统 · 实现思路</h1>
      <p class="subtitle">
        基于 Vue 3 + TypeScript + AntV X6 构建的可视化流程编排画布，面向智能诊断等业务范畴，节点模型通用且可扩展。
      </p>
      <RouterLink to="/scene-flow-chart" class="enter-btn">
        前往流程编排画布 →
      </RouterLink>
    </header>

    <!-- 模块一：官方示例 vs 当前实现 -->
    <section class="module">
      <div class="module-head">
        <span class="module-tag">01</span>
        <h2>官方示例与当前实现的区别</h2>
      </div>
      <p class="module-desc">
        AntV X6 官方示例聚焦于「画布 + 矩形节点 + 基础连线」的能力演示；本项目在此基础上完成了面向业务的工程化封装与交互增强。
      </p>

      <div class="compare">
        <div class="compare-col">
          <h3>官方示例（基础形态）</h3>
          <ul>
            <li>用 <code>Graph</code> 创建画布，搭配几个 <code>rect</code> 矩形节点</li>
            <li>节点用 JSON / attrs 配置，内容为静态文本</li>
            <li>基础 <code>connecting</code> 连线配置，按钮直接 <code>addNode</code></li>
            <li>单一输出连接桩，无分支着色</li>
            <li>无连接校验、无防闭环、无自动布局</li>
          </ul>
        </div>
        <div class="compare-col highlight">
          <h3>当前实现（工程化增强）</h3>
          <ul>
            <li>
              <b>Vue 组件节点</b>：通过 <code>@antv/x6-vue-shape</code> 的
              <code>register</code> 注册 7 类业务节点（开始 / 判断 / 大模型 / 代码 / MCP / 数据库 / 结束），节点内容用 Vue SFC 渲染
            </li>
            <li>
              <b>Dnd 拖拽入画布</b>：左侧菜单 <code>mousedown</code> 触发
              <code>Dnd.start</code>，从菜单拖到画布落地
            </li>
            <li>
              <b>动态连接桩</b>：<code>node:added</code> 时按 shape 挂载；判断节点双输出（Y 绿 / N 红 + 标签）
            </li>
            <li>
              <b>连线动态着色</b>：<code>createEdge</code> 按源端口取色，<code>edge:connected</code> 重连刷新
            </li>
            <li>
              <b>连接校验</b>：<code>validateConnection</code> 做 BFS 防闭环、开始节点不能连入、结束节点不能连出、禁止自连
            </li>
            <li>
              <b>自定义删除工具</b>：注册 image 删除按钮，悬浮节点 / 连线显示，节点删除连带删关联连线
            </li>
            <li>
              <b>选择与框选</b>：Selection 插件，Ctrl/Meta 框选、单击 / 双击选中
            </li>
            <li>
              <b>Dagre 自动布局</b>：<code>@antv/layout</code> 层次布局，一键整理、层内垂直居中
            </li>
            <li>
              <b>缩放 / 平移</b>：滚轮以鼠标为中心缩放、按钮缩放、空白处拖拽平移
            </li>
            <li>
              <b>节点配置抽屉</b>：点击节点 → Vuex 控制抽屉 → 表单保存回写
              <code>node.data</code> → <code>change:data</code> 事件桥接实现描述响应式回显
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 模块二：可扩展性 / 应用范围 / 定制化 -->
    <section class="module">
      <div class="module-head">
        <span class="module-tag">02</span>
        <h2>可扩展性 · 应用范围 · 定制化</h2>
      </div>
      <p class="module-desc">
        系统以「形状（shape）+ 组件 + 图标 + 表单」的统一抽象组织节点，新增业务节点只需四步，无需改动画布核心。
      </p>

      <div class="grid-3">
        <div class="card">
          <h3>可扩展性</h3>
          <ul>
            <li>节点统一抽象：shape 名串联组件、图标、表单四处</li>
            <li>新增节点四步：节点组件 → 图标 → 菜单 / 注册 → 配置表单映射</li>
            <li><code>nodeTools.ts</code> 集中管理连接桩与连线样式</li>
            <li><code>menuList.ts</code> 配置驱动菜单，零硬编码</li>
            <li>Dagre 布局方向 / 间距 / 对齐参数可调</li>
          </ul>
        </div>

        <div class="card">
          <h3>应用范围</h3>
          <ul>
            <li>智能诊断编排：车辆唤醒、信号 / 日志子任务、车控流转</li>
            <li>AI Agent 工作流：LLM 推理 → MCP 工具 → 代码执行 → 数据库查询</li>
            <li>数据处理流水线：采集 → 清洗 → 检索 → 汇总</li>
            <li>审批 / 业务流转：开始 → 条件判断 → 多分支处理 → 结束</li>
          </ul>
        </div>

        <div class="card">
          <h3>定制化</h3>
          <ul>
            <li>节点外观、尺寸、图标自由替换</li>
            <li>连接桩数量与样式（如多输出分支）</li>
            <li>连线着色策略（按端口 / 按业务语义）</li>
            <li>表单字段按节点类型独立定义</li>
            <li>布局方向（LR / TB）与层间距定制</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 模块三：未来展望 -->
    <section class="module">
      <div class="module-head">
        <span class="module-tag">03</span>
        <h2>未来展望 · 可继续拓展的功能</h2>
      </div>
      <p class="module-desc">
        当前系统已具备编排与配置闭环，后续可沿「持久化 → 执行 → 协同」三个方向持续演进。
      </p>

      <div class="future">
        <div class="future-item">
          <h3>数据持久化</h3>
          <p>画布 JSON 序列化与反序列化、后端草稿保存、流程模板库与版本管理。</p>
        </div>
        <div class="future-item">
          <h3>流程执行引擎</h3>
          <p>按拓扑排序执行节点任务、判断节点条件路由求值（Y/N 分支）、运行态节点状态着色 / 高亮。</p>
        </div>
        <div class="future-item">
          <h3>画布增强</h3>
          <p>撤销 / 重做（Undo/Redo）、复制 / 粘贴、对齐分布、小地图 Minimap、节点参数与连线完整性校验。</p>
        </div>
        <div class="future-item">
          <h3>子流程与复用</h3>
          <p>子流程 / 嵌套画布、流程片段封装为可复用模板、跨画布引用。</p>
        </div>
        <div class="future-item">
          <h3>权限与协同</h3>
          <p>节点 / 连线编辑权限控制、多人协同编辑、操作审计日志。</p>
        </div>
        <div class="future-item">
          <h3>运行监控</h3>
          <p>流程实例执行追踪、耗时统计、异常节点定位与重试。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.flow-doc {
  max-width: 1080px;
  margin: 0 auto;
  padding: 8px 4px 40px;
  color: var(--text);
}

.doc-header {
  text-align: center;
  padding: 24px 0 32px;
  border-bottom: 1px solid var(--border);
}

.doc-header h1 {
  font-size: 32px;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}

.doc-header .subtitle {
  max-width: 680px;
  margin: 0 auto 20px;
  color: var(--text);
  line-height: 160%;
}

.enter-btn {
  display: inline-block;
  padding: 9px 22px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  text-decoration: none;
  transition: box-shadow 0.25s, transform 0.15s;
}

.enter-btn:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.module {
  padding: 36px 0;
  border-bottom: 1px solid var(--border);
}

.module-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
}

.module-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 26px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--mono);
  color: var(--accent);
  background: var(--accent-bg);
}

.module-head h2 {
  margin: 0;
  font-size: 22px;
}

.module-desc {
  margin: 0 0 22px;
  color: var(--text);
  line-height: 160%;
}

.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 860px) {
  .compare {
    grid-template-columns: 1fr;
  }
}

.compare-col {
  padding: 20px 22px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.compare-col.highlight {
  border-color: var(--accent-border);
  background: var(--accent-bg);
}

.compare-col h3 {
  margin: 0 0 14px;
  font-size: 17px;
  color: var(--text-h);
}

.compare-col ul {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.compare-col li {
  line-height: 155%;
  color: var(--text);
}

.compare-col li b {
  color: var(--text-h);
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 860px) {
  .grid-3 {
    grid-template-columns: 1fr;
  }
}

.card {
  padding: 20px 22px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.card h3 {
  margin: 0 0 14px;
  font-size: 17px;
  color: var(--text-h);
}

.card ul {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.card li {
  line-height: 155%;
  color: var(--text);
}

.future {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 860px) {
  .future {
    grid-template-columns: 1fr;
  }
}

.future-item {
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.future-item h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: var(--text-h);
}

.future-item p {
  line-height: 155%;
  color: var(--text);
}
</style>
