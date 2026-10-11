<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 面包屑数据：基于 route.matched 自动生成
const breadcrumbs = computed(() => {
  const items: { title: string; path?: string }[] = [
    { title: '首页', path: '/' },
  ]
  route.matched.forEach((record, i) => {
    if (record.meta.title) {
      const isLast = i === route.matched.length - 1
      items.push({
        title: record.meta.title as string,
        path: isLast ? undefined : record.path,
      })
    }
  })
  // 如果首页就是当前页，去掉重复的首页项
  if (route.path === '/') {
    return [{ title: '首页' }]
  }
  return items
})

// 菜单配置
interface MenuItem {
  index: string
  title: string
  icon?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { index: '/', title: '项目简介', icon: 'HomeFilled' },
  { index: '/scene-flow-chart', title: '流程图页面', icon: 'PictureFilled' },
]
</script>

<template>
  <el-container class="app-container">
    <!-- 左侧菜单 -->
    <el-aside width="220px" class="app-aside">
      <div class="logo">任务编排系统</div>
      <el-menu
        :default-active="activeMenu"
        router
        class="app-menu"
        background-color="#001529"
        text-color="rgba(255, 255, 255, 0.65)"
        active-text-color="#fff"
      >
        <template v-for="item in menuItems" :key="item.index">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children" :index="item.index">
            <template #title>
              <el-icon v-if="item.icon">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.index"
              :index="child.index"
            >
              <el-icon v-if="child.icon">
                <component :is="child.icon" />
              </el-icon>
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="item.index">
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container>
      <!-- 顶部导航条 + 面包屑 -->
      <el-header class="app-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbs"
            :key="index"
            :to="item.path ? { path: item.path } : undefined"
          >
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="app-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-container {
  height: 100vh;
}

.app-aside {
  background-color: #001529;
  overflow-x: hidden;
  overflow-y: auto;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.app-menu {
  border-right: none;
}

.app-header {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e5e4e7;
  height: 60px;
}

.app-main {
  background-color: #f5f5f5;
  padding: 20px;
}
</style>
