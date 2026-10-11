<template>
  <el-drawer
    v-model="drawer"
    direction="rtl"
    size="35%"
    :modal="false"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    class="scene-node-drawer"
  >
    <template #header>
      <div class="drawer-title-wrap">
        <img v-if="titleIcon" :src="titleIcon" class="drawer-title-icon" />
        <span>{{ title }}</span>
      </div>
    </template>
    <div class="drawer-container">
      <component
        :is="currentForm"
        v-if="drawer && currentForm"
        :name="initialName"
        :description="initialDescription"
        @save="onSave"
        @cancel="onCancel"
      />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, type Component } from "vue";
import { useStore } from "vuex";
import startForm from "./startForm.vue";
import judgeForm from "./judgeForm.vue";
import llmForm from "./llmForm.vue";
import codeForm from "./codeForm.vue";
import mcpForm from "./mcpForm.vue";
import dbForm from "./dbForm.vue";
import endForm from "./endForm.vue";
import startSvg from "@/assets/canvasIcons/start.svg";
import judgeSvg from "@/assets/canvasIcons/judge.svg";
import llmSvg from "@/assets/canvasIcons/llm.svg";
import codeSvg from "@/assets/canvasIcons/code.svg";
import mcpSvg from "@/assets/canvasIcons/mcp.svg";
import dbSvg from "@/assets/canvasIcons/db.svg";
import endSvg from "@/assets/canvasIcons/end.svg";

interface FormMeta {
  component: Component;
  title: string;
  icon: string;
}

// 节点 shape → 表单组件/标题/图标 映射（文件名与节点 shape 一致 + Form 后缀）
const FORM_MAP: Record<string, FormMeta> = {
  start: { component: startForm, title: "开始", icon: startSvg },
  judge: { component: judgeForm, title: "判断", icon: judgeSvg },
  llm: { component: llmForm, title: "文本大模型", icon: llmSvg },
  code: { component: codeForm, title: "代码", icon: codeSvg },
  mcp: { component: mcpForm, title: "MCP插件", icon: mcpSvg },
  db: { component: dbForm, title: "数据库", icon: dbSvg },
  end: { component: endForm, title: "结束", icon: endSvg },
};

const store = useStore();
const emit = defineEmits<{
  (e: "save", data: { name: string; description: string }): void;
}>();

// 抽屉显隐由 Vuex 控制（showDrawer）
const drawer = computed({
  get: () => store.state.showDrawer,
  set: (v) => store.commit("setShowDrawer", v),
});

const currentNode = computed(() => store.state.currentNode);
const current = computed(() => FORM_MAP[currentNode.value?.shape ?? ""]);
const currentForm = computed(() => current.value?.component);
const title = computed(() => current.value?.title ?? "");
const titleIcon = computed(() => current.value?.icon ?? "");
// 表单预填：当前节点已有的 name/description
const initialName = computed(() => currentNode.value?.name ?? "");
const initialDescription = computed(() => currentNode.value?.description ?? "");

// 表单保存：透传给父组件（flowChart 写回 node.data），由父组件关闭抽屉
const onSave = (data: { name: string; description: string }) => {
  emit("save", data);
};

// 取消：直接关闭抽屉
const onCancel = () => {
  store.commit("setShowDrawer", false);
};
</script>

<style scoped lang="scss">
:deep(.el-drawer__body) {
  padding: 0 20px 20px;
  height: calc(100% - 43px);
  overflow-y: auto;
}
.drawer-title-wrap {
  display: flex;
  align-items: center;
  .drawer-title-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    vertical-align: middle;
  }
}
</style>

<style lang="scss">
/* 抽屉与画布区域对齐 */
.scene-node-drawer {
  top: 129px;
  bottom: 39px;
  height: auto !important;
}
</style>
