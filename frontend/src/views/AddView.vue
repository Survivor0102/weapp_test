<template>
  <div class="add-view">
    <el-card class="form-card">
      <template #header>
        <h2>{{ isEdit ? '编辑待办' : '添加待办' }}</h2>
      </template>
      
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
        label-position="top"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入待办标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入详细描述（可选）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="分类" prop="category_id">
          <el-select
            v-model="formData.category_id"
            placeholder="选择分类"
            clearable
            style="width: 100%"
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
        </el-form-item>
        
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="formData.priority">
            <el-radio value="low">🟢 低</el-radio>
            <el-radio value="medium">🟡 中</el-radio>
            <el-radio value="high">🔴 高</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="截止日期" prop="due_date">
          <el-date-picker
            v-model="formData.due_date"
            type="datetime"
            placeholder="选择截止日期"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '创建待办' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTodoStore } from '../stores/todo'
import { useCategoryStore } from '../stores/category'

const router = useRouter()
const route = useRoute()
const todoStore = useTodoStore()
const categoryStore = useCategoryStore()

const formRef = ref(null)
const submitting = ref(false)

const formData = reactive({
  title: '',
  description: '',
  category_id: null,
  priority: 'medium',
  due_date: ''
})

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 100, message: '标题不能超过 100 个字符', trigger: 'blur' }
  ]
}

// 是否为编辑模式
const isEdit = computed(() => !!route.query.id)

onMounted(async () => {
  await categoryStore.fetchCategories()
  
  // 如果是编辑模式，加载待办数据
  if (isEdit.value) {
    await loadTodoData(route.query.id)
  }
})

// 加载待办数据
async function loadTodoData(id) {
  try {
    const todo = todoStore.todos.find(t => t.id === parseInt(id))
    if (todo) {
      formData.title = todo.title
      formData.description = todo.description || ''
      formData.category_id = todo.category_id
      formData.priority = todo.priority
      formData.due_date = todo.due_date ? todo.due_date.replace(' ', 'T') : ''
    }
  } catch (err) {
    ElMessage.error('加载数据失败')
  }
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      if (isEdit.value) {
        await todoStore.editTodo(route.query.id, formData)
        ElMessage.success('修改成功')
      } else {
        await todoStore.addTodo(formData)
        ElMessage.success('创建成功')
      }
      router.push('/')
    } catch (err) {
      ElMessage.error(isEdit.value ? '修改失败' : '创建失败')
    } finally {
      submitting.value = false
    }
  })
}

// 取消
function handleCancel() {
  router.back()
}
</script>

<style scoped>
.add-view {
  max-width: 600px;
  margin: 0 auto;
}

.form-card {
  border-radius: var(--radius-lg);
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
