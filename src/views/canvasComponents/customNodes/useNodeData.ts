import { ref, onMounted, onUnmounted, type Ref } from "vue";

/**
 * 响应式读取 X6 节点 data 上的字段, node.data 是 X6 内部对象（非 Vue 响应式），直接在模板绑定不会随 setData 更新；
 * 这里通过监听 change:data 事件把最新值同步到 ref，模板才能响应式刷新。
 */
export function useNodeData(node: any, field: string): Ref<string> {
  const read = () => ((node?.data?.[field] ?? "") as string) || "";
  const val = ref<string>(read());
  const sync = () => {
    val.value = read();
  };
  onMounted(() => {
    node?.on?.("change:data", sync);
  });
  onUnmounted(() => {
    node?.off?.("change:data", sync);
  });
  return val;
}
