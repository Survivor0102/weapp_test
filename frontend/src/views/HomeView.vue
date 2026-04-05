<template>
  <div class="home-view">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <span class="stat-icon">📋</span>
            <div class="stat-info">
              <div class="stat-value">{{ todoStore.stats.total }}</div>
              <div class="stat-label">总计</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <span class="stat-icon">✅</span>
            <div class="stat-info">
              <div class="stat-value">{{ todoStore.stats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <span class="stat-icon">⏳</span>
            <div class="stat-info">
              <div class="stat-value">{{ todoStore.stats.active }}</div>
              <div class="stat-label">未完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-button-group>
        <el-button 
          :type="filter === 'all' ? 'primary' : ''"
          @click="filter = 'all'"
        >
          全部
        </el-button>
        <el-button 
          :type="filter === 'active' ? 'primary' : ''"
          @click="filter = 'active'"
        >
          未完成
        </el-button>
        <el-button 
          :type="filter === 'completed' ? 'primary' : ''"
          @click="filter = 'completed'"
        >
          已完成
        </el-button>
      </el-button-group>
      
      <el-select 
        v-model="selectedCategoryId" 
        placeholder="按分类筛选"
        clearable
        style="width: 150px; margin-left: 12px;"
        @change="onCategorySelect"
      >
        <el-option
          v-for="cat in categoryStore.categories"
          :key="cat.id"
          :label="cat.name"
          :value="cat.id"
        >
          <span :style="{ color: cat.color }">●</span> {{ cat.name }}
        </el-option>
      </el-select>
    </div>

    <!-- 待办列表 -->
    <div class="todo-list">
      <el-card v-for="todo in filteredTodos" :key="todo.id" class="todo-card">
        <div class="todo-content">
          <el-checkbox 
            :model-value="todo.completed"
            @change="handleToggleComplete(todo.id)"
          />
          
          <div class="todo-info">
            <div class="todo-title" :class="{ completed: todo.completed }">
              {{ todo.title }}
            </div>
            
            <div class="todo-meta">
              <el-tag 
                v-if="todo.category"
                :color="todo.category.color + '20'"
                :style="{ color: todo.category.color }"
                size="small"
              >
                {{ todo.category.name }}
              </el-tag>
              
              <el-tag 
                :type="getPriorityType(todo.priority)"
                size="small"
                style="margin-left: 8px;"
              >
                {{ getPriorityText(todo.priority) }}
              </el-tag>
              
              <span v-if="todo.due_date" class="due-date">
                📅 {{ formatDate(todo.due_date) }}
              </span>
            </div>
          </div>
          
          <div class="todo-actions">
            <el-button link type="primary" @click="handleEdit(todo.id)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button link type="danger" @click="handleDelete(todo.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </el-card>
      
      <el-empty v-if="filteredTodos.length === 0" description="暂无待办事项" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTodoStore } from '../stores/todo'
import { useCategoryStore } from '../stores/category'

const router = useRouter()
const todoStore = useTodoStore()
const categoryStore = useCategoryStore()

const filter = ref('all')
const selectedCategoryId = ref(null)

// 过滤后的待办列表
const filteredTodos = computed(() => {
  let todos = [...todoStore.todos]
  
  if (filter.value === 'active') {
    todos = todos.filter(t => !t.completed)
  } else if (filter.value === 'completed') {
    todos = todos.filter(t => t.completed)
  } else if (filter.value === 'category' && selectedCategoryId.value) {
    todos = todos.filter(t => t.category_id === selectedCategoryId.value)
  }
  
  return todos.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return new Date(b.created_at) - new Date(a.created_at)
  })
})

onMounted(async () => {
  await Promise.all([
    todoStore.fetchTodos(),
    categoryStore.fetchCategories()
  ])
})

// 切换完成状态
async function handleToggleComplete(id) {
  try {
    await todoStore.toggleComplete(id)
    ElMessage.success('状态已更新')
  } catch (err) {
    ElMessage.error('更新失败')
  }
}

// 编辑待办
function handleEdit(id) {
  router.push(`/add?id=${id}`)
}

// 删除待办
async function handleDelete(id) {
  try {
    await ElMessageBox.confirm('确定要删除这个待办吗？', '删除', {
      type: 'warning'
    })
    await todoStore.removeTodo(id)
    ElMessage.success('已删除')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 分类筛选
function onCategorySelect(value) {
  filter.value = value ? 'category' : 'all'
}

// 获取优先级类型
function getPriorityType(priority) {
  const types = { high: 'danger', medium: 'warning', low: 'success' }
  return types[priority] || ''
}

// 获取优先级文本
function getPriorityText(priority) {
  const texts = { high: '🔴 高', medium: '🟡 中', low: '🟢 低' }
  return texts[priority] || ''
}

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<style scoped>
.home-view {
  padding: var(--spacing-md);
}

.stats-row {
  margin-bottom: var(--spacing-lg);
}

.stat-card {
  border-radius: var(--radius-lg);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  color: var(--text-light);
  font-size: 0.9rem;
}

.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.todo-card {
  border-radius: var(--radius-md);
  transition: box-shadow 0.2s;
}

.todo-card:hover {
  box-shadow: var(--shadow-md);
}

.todo-content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.todo-info {
  flex: 1;
  min-width: 0;
}

.todo-title {
  font-size: 1rem;
  margin-bottom: var(--spacing-xs);
}

.todo-title.completed {
  text-decoration: line-through;
  color: var(--text-light);
}

.todo-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.due-date {
  font-size: 0.85rem;
  color: var(--text-light);
}

.todo-actions {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
