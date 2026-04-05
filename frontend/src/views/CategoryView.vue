<template>
  <div class="category-view">
    <el-card class="category-card">
      <template #header>
        <div class="card-header">
          <h2>分类管理</h2>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon> 新建分类
          </el-button>
        </div>
      </template>
      
      <div class="category-list">
        <el-card v-for="category in categoryStore.categories" :key="category.id" class="category-item">
          <div class="category-content">
            <div class="category-color" :style="{ backgroundColor: category.color }" />
            
            <div class="category-info">
              <div class="category-name">{{ category.name }}</div>
              <div class="category-meta">
                <el-tag v-if="category.is_default" size="small" type="info">默认</el-tag>
              </div>
            </div>
            
            <div class="category-actions">
              <el-button 
                link 
                type="primary" 
                @click="handleEdit(category)"
                :disabled="category.is_default"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button 
                link 
                type="danger" 
                @click="handleDelete(category)"
                :disabled="category.is_default"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
    
    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingCategory ? '编辑分类' : '新建分类'"
      width="400px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="60px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="分类名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="form.color" />
        </el-form-item>
        
        <el-form-item label="图标" prop="icon">
          <el-select v-model="form.icon" placeholder="选择图标" style="width: 100%">
            <el-option value="work" label="💼 工作" />
            <el-option value="life" label="🏠 生活" />
            <el-option value="study" label="📚 学习" />
            <el-option value="other" label="📌 其他" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useCategoryStore } from '../stores/category.js'

const categoryStore = useCategoryStore()

const showAddDialog = ref(false)
const editingCategory = ref(null)
const submitting = ref(false)
const formRef = ref(null)

const form = reactive({
  name: '',
  color: '#3498db',
  icon: 'other'
})

const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { max: 20, message: '名称不能超过 20 个字符', trigger: 'blur' }
  ]
}

onMounted(async () => {
  await categoryStore.fetchCategories()
})

// 编辑分类
function handleEdit(category) {
  editingCategory.value = category
  form.name = category.name
  form.color = category.color
  form.icon = category.icon
  showAddDialog.value = true
}

// 删除分类
async function handleDelete(category) {
  try {
    await ElMessageBox.confirm(`确定要删除分类"${category.name}"吗？`, '删除', {
      type: 'warning'
    })
    await categoryStore.removeCategory(category.id)
    ElMessage.success('已删除')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      if (editingCategory.value) {
        await categoryStore.updateCategory(editingCategory.value.id, form)
        ElMessage.success('修改成功')
      } else {
        await categoryStore.addCategory(form)
        ElMessage.success('创建成功')
      }
      showAddDialog.value = false
    } catch (err) {
      ElMessage.error('操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// 重置表单
function resetForm() {
  editingCategory.value = null
  form.name = ''
  form.color = '#3498db'
  form.icon = 'other'
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}
</script>

<style scoped>
.category-view {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.category-item {
  border-radius: var(--radius-md);
}

.category-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.category-color {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: 1rem;
  font-weight: 500;
}

.category-meta {
  margin-top: var(--spacing-xs);
}

.category-actions {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
