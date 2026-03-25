// components/filter-bar/filter-bar.js
Component({
  properties: {
    currentFilter: {
      type: String,
      value: 'all'
    },
    categories: {
      type: Array,
      value: []
    },
    selectedCategoryId: {
      type: String,
      value: null
    }
  },

  methods: {
    /**
     * 切换筛选类型
     */
    onFilterChange(e) {
      const { type } = e.currentTarget.dataset
      this.triggerEvent('filterChange', { type })
    },

    /**
     * 选择分类
     */
    onCategorySelect(e) {
      const { id } = e.currentTarget.dataset
      this.triggerEvent('categorySelect', { id })
    },

    /**
     * 管理分类
     */
    onManageCategory() {
      this.triggerEvent('manageCategory')
    }
  }
})
