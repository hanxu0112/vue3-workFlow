import { createStore } from "vuex";

// 节点表单抽屉的全局控制状态（控制 nodeCommonDialog 的显隐与当前编辑节点）
export interface CurrentNode {
  id: string;
  shape: string;
  name: string;
  description: string;
}

interface State {
  showDrawer: boolean; // nodeCommonDialog 抽屉显隐
  currentNode: CurrentNode | null; // 当前点击节点的快照（供表单预填）
}

export default createStore<State>({
  state: {
    showDrawer: false,
    currentNode: null,
  },
  mutations: {
    setShowDrawer(state: State, value: boolean) {
      state.showDrawer = value;
    },
    setCurrentNode(state: State, node: CurrentNode | null) {
      state.currentNode = node;
    },
  },
  getters: {
    showDrawer: (state: State) => state.showDrawer,
    currentNode: (state: State) => state.currentNode,
  },
});
