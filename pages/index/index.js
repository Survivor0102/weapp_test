// pages/index/index.js
import { getAllTodos, updateTodo, deleteTodo, getAllCategories } from '../../utils/storage'
import { showToast, showModal, navigateTo } from '../../utils/util'
import { formatDueDate, getRelativeTime } from '../../utils/date'

Page({
  data: {
    todos: [],
    filteredTodos: [],
    categories: [],
    currentFilter: 'all', // all, active, completed, category
    selectedCategoryId: null,
    stats: {
      total: 0,
      completed: 0,
      active: 0
    }
  },

  onLoad() {
    this.loadTodos()
    this.loadCategories()
  },

  onShow() {
    // 每次页面显示时刷新数据
    this.loadTodos()
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadTodos()
    this.loadCategories()
    wx.stopPullDownRefresh()
  },

  /**
   * 加载待办列表
   */
  loadTodos() {
    const todos = getAllTodos()
    const completed = todos.filter(t => t.completed).length
    const active = todos.length - completed

    this.setData({
      todos,
      stats: {
        total: todos.length,
        completed,
        active
      }
    })

    this.applyFilter()
  },

  /**
   * 加载分类列表
   */
  loadCategories() {
    const categories = getAllCategories()
    this.setData({ categories })
  },

  /**
   * 应用筛选
   */
  applyFilter() {
    const { todos, currentFilter, selectedCategoryId } = this.data
    let filtered = [...todos]

    if (currentFilter === 'active') {
      filtered = filtered.filter(t => !t.completed)
    } else if (currentFilter === 'completed') {
      filtered = filtered.filter(t => t.completed)
    } else if (currentFilter === 'category' && selectedCategoryId) {
      filtered = filtered.filter(t => t.categoryId === selectedCategoryId)
    }

    this.setData({ filteredTodos: filtered })
  },

  /**
   * 切换筛选类型
   */
  onFilterChange(e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      currentFilter: type,
      selectedCategoryId: type !== 'category' ? null : this.data.selectedCategoryId
    })
    this.applyFilter()
  },

  /**
   * 选择分类筛选
   */
  onCategorySelect(e) {
    const { id } = e.currentTarget.dataset
    const { selectedCategoryId } = this.data
    
    if (selectedCategoryId === id) {
      // 取消选择
      this.setData({
        currentFilter: 'all',
        selectedCategoryId: null
      })
    } else {
      // 选择分类
      this.setData({
        currentFilter: 'category',
        selectedCategoryId: id
      })
    }
    this.applyFilter()
  },

  /**
   * 切换完成状态
   */
  onToggleComplete(e) {
    const { id } = e.currentTarget.dataset
    const todo = this.data.todos.find(t => t.id === id)
    if (todo) {
      updateTodo(id, { completed: !todo.completed })
      showToast(todo.completed ? '已取消完成' : '已完成')
      this.loadTodos()
    }
  },

  /**
   * 编辑待办
   */
  onEditTodo(e) {
    const { id } = e.currentTarget.dataset
    navigateTo(`/pages/add/add?id=${id}`)
  },

  /**
   * 删除待办
   */
  async onDeleteTodo(e) {
    const { id } = e.currentTarget.dataset
    const confirmed = await showModal('确定要删除这个待办吗？', '删除')
    if (confirmed) {
      deleteTodo(id)
      showToast('已删除')
      this.loadTodos()
    }
  },

  /**
   * 前往新增页面
   */
  onAddTodo() {
    navigateTo('/pages/add/add')
  },

  /**
   * 前往分类管理
   */
  onManageCategory() {
    navigateTo('/pages/category/category')
  },

  /**
   * 格式化时间
   */
  formatDueDate(timestamp) {
    return formatDueDate(timestamp)
  },

  getRelativeTime(timestamp) {
    return getRelativeTime(timestamp)
  },

  /**
   * 获取分类名称
   */
  getCategoryName(categoryId) {
    const category = this.data.categories.find(c => c.id === categoryId)
    return category ? category.name : ''
  },

  /**
   * 获取分类颜色
   */
  getCategoryColor(categoryId) {
    const category = this.data.categories.find(c => c.id === categoryId)
    return category ? category.color : '#95a5a6'
  },

  /**
   * 获取优先级颜色
   */
  getPriorityColor(priority) {
    const colors = {
      high: 'var(--priority-high)',
      medium: 'var(--priority-medium)',
      low: 'var(--priority-low)'
    }
    return colors[priority] || ''
  },

  /**
   * 获取优先级文本
   */
  getPriorityText(priority) {
    const texts = {
      high: '🔴 高',
      medium: '🟡 中',
      low: '🟢 低'
    }
    return texts[priority] || ''
  }
})
