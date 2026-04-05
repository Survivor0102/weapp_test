<template>
  <div class="pomodoro-view">
    <el-row :gutter="24">
      <!-- 左侧：番茄钟 -->
      <el-col :span="14">
        <el-card class="timer-card">
          <div class="timer-header">
            <el-radio-group v-model="pomodoroStore.mode" @change="handleModeChange">
              <el-radio-button value="work">
                🍅 工作
              </el-radio-button>
              <el-radio-button value="shortBreak">
                ☕ 短休息
              </el-radio-button>
              <el-radio-button value="longBreak">
                🌴 长休息
              </el-radio-button>
            </el-radio-group>
          </div>
          
          <div class="timer-display">
            <div class="time">{{ formatTime }}</div>
            <div class="mode-label">
              {{ modeLabels[pomodoroStore.mode] }}
            </div>
          </div>
          
          <div class="timer-controls">
            <el-button
              v-if="!pomodoroStore.isRunning"
              type="success"
              size="large"
              @click="handleStart"
            >
              <el-icon><Play /></el-icon>
              开始
            </el-button>
            <el-button
              v-else
              type="warning"
              size="large"
              @click="handlePause"
            >
              <el-icon><Pause /></el-icon>
              暂停
            </el-button>
            
            <el-button
              size="large"
              @click="handleReset"
            >
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </div>
          
          <div class="timer-todo">
            <el-select
              v-model="pomodoroStore.currentTodoId"
              placeholder="关联待办（可选）"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="todo in todoStore.todos.filter(t => !t.completed)"
                :key="todo.id"
                :label="todo.title"
                :value="todo.id"
              />
            </el-select>
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧：统计 -->
      <el-col :span="10">
        <el-card class="stats-card">
          <template #header>
            <h3>今日统计</h3>
          </template>
          
          <div v-loading="pomodoroStore.loading">
            <div class="stat-item">
              <div class="stat-label">专注次数</div>
              <div class="stat-value">{{ pomodoroStore.todayStats?.count || 0 }}</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-label">专注时长</div>
              <div class="stat-value">{{ pomodoroStore.todayStats?.total_minutes || 0 }} 分钟</div>
            </div>
            
            <el-divider />
            
            <div class="stat-item">
              <div class="stat-label">目标</div>
              <div class="stat-value">8 个番茄</div>
              <el-progress
                :percentage="Math.min(100, ((pomodoroStore.todayStats?.count || 0) / 8) * 100)"
                :stroke-width="10"
                :show-text="false"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Play, Pause, Refresh } from '@element-plus/icons-vue'
import { useTodoStore } from '../stores/todo.js'
import { usePomodoroStore } from '../stores/pomodoro.js'

const todoStore = useTodoStore()
const pomodoroStore = usePomodoroStore()

let timerInterval = null

const modeLabels = {
  work: '专注时间',
  shortBreak: '短休息',
  longBreak: '长休息'
}

// 格式化时间显示
const formatTime = computed(() => {
  const minutes = Math.floor(pomodoroStore.currentTime / 60)
  const seconds = pomodoroStore.currentTime % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

onMounted(async () => {
  await Promise.all([
    todoStore.fetchTodos(),
    pomodoroStore.fetchTodayStats()
  ])
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

// 切换模式
function handleModeChange() {
  pomodoroStore.resetTimer()
}

// 开始计时
function handleStart() {
  pomodoroStore.startTimer()
  timerInterval = setInterval(() => {
    pomodoroStore.tick()
    
    if (pomodoroStore.currentTime === 0) {
      handleComplete()
    }
  }, 1000)
}

// 暂停计时
function handlePause() {
  pomodoroStore.pauseTimer()
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// 重置计时
function handleReset() {
  handlePause()
  pomodoroStore.resetTimer()
}

// 完成计时
async function handleComplete() {
  handlePause()
  
  // 播放提示音（可选）
  ElMessage.success(`${modeLabels[pomodoroStore.mode]}完成！`)
  
  // 如果是工作模式，记录番茄钟
  if (pomodoroStore.mode === 'work') {
    try {
      await pomodoroStore.recordPomodoro({
        todo_id: pomodoroStore.currentTodoId,
        duration: pomodoroStore.modeConfig.work
      })
    } catch (err) {
      console.error('记录番茄钟失败:', err)
    }
  }
  
  // 自动切换到休息模式
  if (pomodoroStore.mode === 'work') {
    pomodoroStore.setMode('shortBreak')
  } else {
    pomodoroStore.setMode('work')
  }
}
</script>

<style scoped>
.pomodoro-view {
  padding: var(--spacing-md);
}

.timer-card {
  border-radius: var(--radius-lg);
}

.timer-header {
  margin-bottom: var(--spacing-lg);
}

.timer-display {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.time {
  font-size: 5rem;
  font-weight: bold;
  color: var(--primary-color);
  font-family: 'Courier New', monospace;
}

.mode-label {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-top: var(--spacing-sm);
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.timer-todo {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-md);
}

.stats-card {
  border-radius: var(--radius-lg);
}

.stat-item {
  margin-bottom: var(--spacing-lg);
}

.stat-label {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}
</style>
