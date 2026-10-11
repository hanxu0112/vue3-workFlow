<template>
  <el-form :model="formData" label-width="90px" class="node-form">
    <el-form-item label="节点名称">
      <el-input v-model="formData.name" placeholder="请输入节点名称" clearable />
    </el-form-item>
    <el-form-item label="节点描述">
      <el-input
        v-model="formData.description"
        type="textarea"
        :rows="3"
        placeholder="请输入节点描述"
      />
    </el-form-item>
    <div class="form-footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const props = defineProps<{
  name?: string;
  description?: string;
}>();

const emit = defineEmits<{
  (e: "save", data: { name: string; description: string }): void;
  (e: "cancel"): void;
}>();

// 预填当前节点已有内容（每次打开抽屉组件重新挂载，读取最新 props）
const formData = reactive({
  name: props.name ?? "",
  description: props.description ?? "",
});

const onSave = () => {
  emit("save", { ...formData });
};

const onCancel = () => {
  emit("cancel");
};
</script>

<style scoped lang="scss">
.node-form {
  padding: 8px 0;
}
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
</style>
