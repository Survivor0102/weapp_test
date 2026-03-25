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
    categoryName: '',
    categoryColor: '',
    categories: [],
    categoryIndex: 0,
    priority: 'medium',
    priorityLabel: '中',
    priorityColor: '#f39c12',
    priorityIndex: 1,
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
      
      // 获取分类信息
      const category = this.data.categories.find(c => c.id === todo.categoryId)
      const categoryName = category ? category.name : '未分类'
      const categoryColor = category ? category.color : '#95a5a6'
      const categoryIndex = category ? this.data.categories.findIndex(c => c.id === todo.categoryId) : 0
      
      // 获取优先级信息
      const priorityOption = this.data.priorityOptions.find(p => p.value === (todo.priority || 'medium'))
      const priorityLabel = priorityOption ? priorityOption.label : '中'
      const priorityColor = priorityOption ? priorityOption.color : '#f39c12'
      const priorityIndex = this.data.priorityOptions.findIndex(p => p.value === (todo.priority || 'medium'))
      
      this.setData({
        title: todo.title || '',
        categoryId: todo.categoryId || '',
        categoryName,
        categoryColor,
        categoryIndex,
        priority: todo.priority || 'medium',
        priorityLabel,
        priorityColor,
        priorityIndex,
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
    const category = this.data.categories[index]
    this.setData({ 
      categoryId: category.id,
      categoryName: category.name,
      categoryColor: category.color,
      categoryIndex: index
    })
  },

  /**
   * 选择优先级
   */
  onPriorityChange(e) {
    const index = e.detail.value
    const option = this.data.priorityOptions[index]
    this.setData({ 
      priority: option.value,
      priorityLabel: option.label,
      priorityColor: option.color,
      priorityIndex: index
    })
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
  }
})
