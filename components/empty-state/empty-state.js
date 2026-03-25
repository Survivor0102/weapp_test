// components/empty-state/empty-state.js
Component({
  properties: {
    filterType: {
      type: String,
      value: 'all'
    },
    customText: {
      type: String,
      value: ''
    }
  },

  data: {
    defaultTexts: {
      all: '还没有待办事项',
      active: '没有未完成的待办',
      completed: '没有已完成的待办',
      category: '该分类下没有待办'
    }
  },

  methods: {
    getText() {
      const { customText, filterType } = this.data
      if (customText) {
        return customText
      }
      return this.data.defaultTexts[filterType] || '暂无数据'
    }
  }
})
