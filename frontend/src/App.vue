<template>
  <div class="app-container">
    <el-container>
      <el-header class="app-header">
        <div class="header-content">
          <h1 class="app-title">📝 待办事项 + 🍅 番茄钟</h1>
          <el-menu
            mode="horizontal"
            :router="true"
            :default-active="$route.path"
            background-color="transparent"
            text-color="var(--text-color)"
            active-text-color="var(--primary-color)"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/add">添加</el-menu-item>
            <el-menu-item index="/category">分类</el-menu-item>
            <el-menu-item index="/pomodoro">番茄钟</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
// App 组件
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  background-color: var(--card-bg);
  box-shadow: var(--shadow-sm);
  padding: 0;
  height: auto;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-lg);
}

.app-title {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

:deep(.el-menu) {
  border-bottom: none;
  justify-content: center;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}
</style>
