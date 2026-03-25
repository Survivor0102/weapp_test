// components/virtual-list/virtual-list.js
Component({
  properties: {
    // 列表数据
    items: {
      type: Array,
      value: [],
      observer: 'onItemsChange'
    },
    // 每项高度（rpx）
    itemHeight: {
      type: Number,
      value: 160
    },
    // 缓冲区大小（渲染多少项）
    bufferSize: {
      type: Number,
      value: 5
    },
    // 是否启用虚拟滚动（少于这个数量不启用）
    threshold: {
      type: Number,
      value: 20
    }
  },

  data: {
    // 可见区域的数据
    visibleItems: [],
    // 偏移高度
    offsetTop: 0,
    // 总高度
    totalHeight: 0,
    // 起始索引
    startIndex: 0,
    // 结束索引
    endIndex: 0,
    // 是否启用虚拟滚动
    enableVirtual: false
  },

  lifetimes: {
    attached() {
      this.initVirtualList()
    }
  },

  methods: {
    /**
     * 初始化虚拟列表
     */
    initVirtualList() {
      const { items, threshold } = this.data
      const enableVirtual = items.length > threshold
      
      this.setData({
        enableVirtual,
        totalHeight: items.length * this.data.itemHeight
      })

      if (enableVirtual) {
        this.calculateVisibleItems(0)
      } else {
        this.setData({
          visibleItems: items,
          offsetTop: 0
        })
      }
    },

    /**
     * 数据变化时
     */
    onItemsChange(newItems) {
      const { threshold, itemHeight } = this.data
      const enableVirtual = newItems.length > threshold
      
      this.setData({
        enableVirtual,
        totalHeight: newItems.length * itemHeight
      })

      if (enableVirtual) {
        this.calculateVisibleItems(this.data.offsetTop)
      } else {
        this.setData({
          visibleItems: newItems,
          offsetTop: 0
        })
      }
    },

    /**
     * 计算可见区域的项目
     */
    calculateVisibleItems(scrollTop) {
      const { items, itemHeight, bufferSize } = this.data
      
      // 转换为 px（1rpx = 0.5px）
      const itemHeightPx = itemHeight * 0.5
      const scrollTopPx = scrollTop * 0.5

      // 计算起始索引
      const startIndex = Math.max(0, Math.floor(scrollTopPx / itemHeightPx) - bufferSize)
      
      // 计算结束索引（假设屏幕高度为 1334px，约 2668rpx）
      const screenHeight = 2668
      const visibleCount = Math.ceil(screenHeight / itemHeightPx)
      const endIndex = Math.min(items.length, startIndex + visibleCount + bufferSize * 2)

      // 获取可见区域的数据
      const visibleItems = items.slice(startIndex, endIndex)

      // 计算偏移高度
      const offsetTop = startIndex * itemHeight

      this.setData({
        visibleItems,
        offsetTop,
        startIndex,
        endIndex
      })
    },

    /**
     * 滚动事件
     */
    onScroll(e) {
      const { enableVirtual } = this.data
      if (!enableVirtual) return

      const scrollTop = e.detail.scrollTop
      this.calculateVisibleItems(scrollTop)

      // 触发滚动事件
      this.triggerEvent('scroll', {
        scrollTop,
        startIndex: this.data.startIndex,
        endIndex: this.data.endIndex
      })
    },

    /**
     * 点击项目
     */
    onItemClick(e) {
      const { index } = e.currentTarget.dataset
      const { startIndex } = this.data
      const realIndex = startIndex + index
      
      this.triggerEvent('itemclick', {
        index: realIndex,
        item: this.data.items[realIndex]
      })
    },

    /**
     * 复选框切换
     */
    onToggle(e) {
      const { index } = e.currentTarget.dataset
      const { startIndex } = this.data
      const realIndex = startIndex + index
      
      this.triggerEvent('toggle', {
        index: realIndex,
        item: this.data.items[realIndex]
      })
    },

    /**
     * 删除项目
     */
    onDelete(e) {
      const { index } = e.currentTarget.dataset
      const { startIndex } = this.data
      const realIndex = startIndex + index
      
      this.triggerEvent('delete', {
        index: realIndex,
        item: this.data.items[realIndex]
      })
    }
  }
})
