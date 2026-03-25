// pages/category/category.js
import { getAllCategories, addCategory, updateCategory, deleteCategory, generateId } from '../../utils/storage'
import { showToast, showModal, navigateBack } from '../../utils/util'

const defaultColors = [
  '#3498db', '#2ecc71', '#9b59b6', '#e74c3c', 
  '#f39c12', '#1abc9c', '#34495e', '#95a5a6'
]

Page({
  data: {
    categories: [],
    editingId: null,
    editName: '',
    editColor: '',
    showEditModal: false,
    colorOptions: defaultColors
  },

  onLoad() {
    this.loadCategories()
  },

  onShow() {
    this.loadCategories()
  },

  /**
   * 加载分类列表
   */
  loadCategories() {
    const categories = getAllCategories()
    this.setData({ categories })
  },

  /**
   * 显示新增/编辑弹窗
   */
  showEditModal(category = null) {
    if (category) {
      this.setData({
        editingId: category.id,
        editName: category.name,
        editColor: category.color,
        showEditModal: true
      })
    } else {
      const randomColor = defaultColors[Math.floor(Math.random() * defaultColors.length)]
      this.setData({
        editingId: null,
        editName: '',
        editColor: randomColor,
        showEditModal: true
      })
    }
  },

  /**
   * 隐藏弹窗
   */
  hideEditModal() {
    this.setData({
      editingId: null,
      editName: '',
      editColor: '',
      showEditModal: false
    })
  },

  /**
   * 名称输入
   */
  onNameInput(e) {
    this.setData({
      editName: e.detail.value
    })
  },

  /**
   * 选择颜色
   */
  onColorSelect(e) {
    const { color } = e.currentTarget.dataset
    this.setData({ editColor: color })
  },

  /**
   * 新增分类
   */
  onAddCategory() {
    this.showEditModal()
  },

  /**
   * 编辑分类
   */
  onEditCategory(e) {
    const { id } = e.currentTarget.dataset
    const category = this.data.categories.find(c => c.id === id)
    if (category) {
      this.showEditModal(category)
    }
  },

  /**
   * 删除分类
   */
  async onDeleteCategory(e) {
    const { id } = e.currentTarget.dataset
    const confirmed = await showModal('确定要删除这个分类吗？删除后该分类下的待办将变为"其他"分类。', '删除')
    if (confirmed) {
      deleteCategory(id)
      showToast('已删除')
      this.loadCategories()
    }
  },

  /**
   * 保存分类
   */
  onSaveCategory() {
    const { editingId, editName, editColor } = this.data

    if (!editName || !editName.trim()) {
      showToast('请输入分类名称', 'none')
      return
    }

    if (editingId) {
      // 编辑模式
      updateCategory(editingId, {
        name: editName.trim(),
        color: editColor
      })
      showToast('保存成功')
    } else {
      // 新增模式
      const newCategory = {
        id: generateId(),
        name: editName.trim(),
        color: editColor,
        icon: 'custom'
      }
      addCategory(newCategory)
      showToast('添加成功')
    }

    this.hideEditModal()
    this.loadCategories()
  },

  /**
   * 返回
   */
  onBack() {
    navigateBack()
  }
})
