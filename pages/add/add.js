// pages/add/add.js
import { generateId, addTodo, updateTodo, getTodoById, getAllCategories } from '../../utils/storage'
import { showToast, navigateBack } from '../../utils/util'
import { formatDate } from '../../utils/date'

Page({
  data: {
    id: null,
    isEdit: false,
    title: '',
    categoryId: '',
    categories: [],
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    priorityOptions: [
      { label: '高', value: 'high', color: '#e74c3c' },
      { label: '中', value: 'medium', color: '#f39c12' },
      { label: '低', value: 'low', color: '#2ecc71' }
    ]
  },

  onLoad(options) {
    this.loadCategories()
    
    // 如果有 id 参数，说明是编辑模式
    if (options.id) {
      this.setData({
        id: options.id,
        isEdit: true
      })
      this.loadTodoData(options.id)
      wx.setNavigationBarTitle({ title: '编辑待办' })
    } else {
      wx.setNavigationBarTitle({ title: '新增待办' })
    }
  },

  /**
   * 加载分类列表
   */
  loadCategories() {
    const categories = getAllCategories()
    this.setData({ categories })
  },

  /**
   * 加载待办数据（编辑模式）
   */
  loadTodoData(id) {
    const todo = getTodoById(id)
    if (todo) {
      const dueDate = todo.dueDate ? formatDate(todo.dueDate) : ''
      const dueTime = todo.dueDate ? this.formatTime(todo.dueDate) : ''
      
      this.setData({
        title: todo.title || '',
        categoryId: todo.categoryId || '',
        priority: todo.priority || 'medium',
        dueDate,
        dueTime
      })
    }
  },

  /**
   * 格式化时间
   */
  formatTime(timestamp) {
    const date = new Date(timestamp)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  },

  /**
   * 标题输入
   */
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },

  /**
   * 选择分类
   */
  onCategoryChange(e) {
    const index = e.detail.value
    const categoryId = this.data.categories[index].id
    this.setData({ categoryId })
  },

  /**
   * 选择优先级
   */
  onPriorityChange(e) {
    const index = e.detail.value
    const priority = this.data.priorityOptions[index].value
    this.setData({ priority })
  },

  /**
   * 选择日期
   */
  onDateChange(e) {
    this.setData({
      dueDate: e.detail.value
    })
  },

  /**
   * 选择时间
   */
  onTimeChange(e) {
    this.setData({
      dueTime: e.detail.value
    })
  },

  /**
   * 保存待办
   */
  onSave() {
    const { title, isEdit, id, categoryId, priority, dueDate, dueTime } = this.data

    // 验证标题
    if (!title || !title.trim()) {
      showToast('请输入待办内容', 'none')
      return
    }

    // 合并日期和时间
    let dueDateTimestamp = null
    if (dueDate) {
      const [year, month, day] = dueDate.split('-').map(Number)
      let hours = 0
      let minutes = 0
      
      if (dueTime) {
        [hours, minutes] = dueTime.split(':').map(Number)
      }
      
      const dateObj = new Date(year, month - 1, day, hours, minutes)
      dueDateTimestamp = dateObj.getTime()
    }

    if (isEdit) {
      // 编辑模式
      updateTodo(id, {
        title: title.trim(),
        categoryId,
        priority,
        dueDate: dueDateTimestamp
      })
      showToast('保存成功')
    } else {
      // 新增模式
      const newTodo = {
        id: generateId(),
        title: title.trim(),
        completed: false,
        categoryId,
        priority,
        dueDate: dueDateTimestamp,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      addTodo(newTodo)
      showToast('添加成功')
    }

    // 返回上一页
    setTimeout(() => {
      navigateBack()
    }, 500)
  },

  /**
   * 取消
   */
  onCancel() {
    navigateBack()
  },

  /**
   * 获取分类名称
   */
  getCategoryName(categoryId) {
    const category = this.data.categories.find(c => c.id === categoryId)
    return category ? category.name : ''
  },

  /**
   * 获取优先级索引
   */
  get priorityIndex() {
    const { priority, priorityOptions } = this.data
    return priorityOptions.findIndex(p => p.value === priority)
  },

  /**
   * 获取分类索引
   */
  get categoryIndex() {
    const { categoryId, categories } = this.data
    if (!categoryId) return 0
    return categories.findIndex(c => c.id === categoryId)
  },

  /**
   * 获取优先级颜色
   */
  getPriorityColor(priority) {
    const option = this.data.priorityOptions.find(p => p.value === priority)
    return option ? option.color : '#f39c12'
  },

  /**
   * 获取优先级标签
   */
  getPriorityLabel(priority) {
    const option = this.data.priorityOptions.find(p => p.value === priority)
    return option ? option.label : '中'
  }
})
