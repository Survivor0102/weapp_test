// components/todo-item/todo-item.js
Component({
  properties: {
    todo: {
      type: Object,
      value: null,
      observer: 'onTodoChange'
    },
    category: {
      type: Object,
      value: null
    }
  },

  data: {
    priorityTexts: {
      high: '🔴 高',
      medium: '🟡 中',
      low: '🟢 低'
    }
  },

  methods: {
    onTodoChange() {
      // todo 变化时的处理
    },

    /**
     * 切换完成状态
     */
    onToggleComplete() {
      this.triggerEvent('toggle', {
        id: this.data.todo.id
      })
    },

    /**
     * 编辑
     */
    onEdit() {
      this.triggerEvent('edit', {
        id: this.data.todo.id
      })
    },

    /**
     * 删除
     */
    onDelete() {
      this.triggerEvent('delete', {
        id: this.data.todo.id
      })
    },

    /**
     * 格式化时间
     */
    formatDueDate(timestamp) {
      if (!timestamp) return ''
      
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const due = new Date(timestamp)
      const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())

      const hours = String(due.getHours()).padStart(2, '0')
      const minutes = String(due.getMinutes()).padStart(2, '0')
      const timeStr = `${hours}:${minutes}`

      if (dueDate.getTime() === today.getTime()) {
        return `今天 ${timeStr}`
      } else if (dueDate.getTime() === tomorrow.getTime()) {
        return `明天 ${timeStr}`
      } else {
        const month = String(due.getMonth() + 1).padStart(2, '0')
        const day = String(due.getDate()).padStart(2, '0')
        return `${month}-${day} ${timeStr}`
      }
    },

    /**
     * 获取优先级颜色
     */
    getPriorityColor(priority) {
      const colors = {
        high: '#e74c3c',
        medium: '#f39c12',
        low: '#2ecc71'
      }
      return colors[priority] || '#95a5a6'
    }
  }
})
