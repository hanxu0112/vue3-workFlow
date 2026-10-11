<template>
  <div class="node-content">
    <span class="icon-box">
      <img src="@/assets/canvasIcons/mcp.svg" alt="mcp" />
    </span>
    <el-tooltip
      class="item"
      effect="dark"
      :content="description"
      placement="top"
      v-if="description.length > 10"
    >
      <span class="text">{{ description.substring(0, 8) + "..." }}</span>
    </el-tooltip>
    <span class="text" v-else>{{ description }}</span>
  </div>
</template>

<script setup lang="ts">
import { useNodeData } from "./useNodeData";

const props = defineProps<{ node?: any }>();
const description = useNodeData(props.node, "description");
</script>

<style scoped lang="scss">
@import url("./css/nodeStyle.scss");
</style>
