// cloudfunctions/pomodoro/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 记录番茄钟
 */
async function record(event) {
  const { OPENID } = cloud.getWXContext()
  const { todoId, duration } = event
  
  try {
    await db.collection('pomodoro').add({
      data: {
        _openid: OPENID,
        todoId: todoId || null,
        duration: duration || 25,
        completedAt: db.serverDate()
      }
    })
    
    // 更新待办的专注时间
    if (todoId) {
      const todo = await db.collection('todos').doc(todoId).get()
      if (todo.data) {
        await db.collection('todos').doc(todoId).update({
          data: {
            focusTime: (todo.data.focusTime || 0) + duration
          }
        })
      }
    }
    
    return {
      success: true
    }
  } catch (err) {
    console.error('记录番茄钟失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

/**
 * 获取今日统计
 */
async function getTodayStats(event) {
  const { OPENID } = cloud.getWXContext()
  
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const res = await db.collection('pomodoro')
      .where({
        _openid: OPENID,
        completedAt: _.gte(today.getTime())
      })
      .get()
    
    const totalMinutes = res.data.reduce((sum, p) => sum + p.duration, 0)
    
    return {
      success: true,
      data: {
        count: res.data.length,
        totalMinutes,
        records: res.data
      }
    }
  } catch (err) {
    console.error('获取统计失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

/**
 * 获取历史统计
 */
async function getHistoryStats(event) {
  const { OPENID } = cloud.getWXContext()
  const { startDate, endDate } = event
  
  try {
    const res = await db.collection('pomodoro')
      .where({
        _openid: OPENID,
        completedAt: _.gte(startDate),
        completedAt: _.lte(endDate)
      })
      .get()
    
    const totalMinutes = res.data.reduce((sum, p) => sum + p.duration, 0)
    
    // 按日期分组统计
    const dailyStats = {}
    res.data.forEach(p => {
      const date = new Date(p.completedAt).toISOString().split('T')[0]
      if (!dailyStats[date]) {
        dailyStats[date] = { count: 0, minutes: 0 }
      }
      dailyStats[date].count += 1
      dailyStats[date].minutes += p.duration
    })
    
    return {
      success: true,
      data: {
        totalCount: res.data.length,
        totalMinutes,
        dailyStats
      }
    }
  } catch (err) {
    console.error('获取历史统计失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

// 云函数入口
exports.main = async (event, context) => {
  const { action } = event
  
  switch (action) {
    case 'record':
      return await record(event)
    case 'getTodayStats':
      return await getTodayStats(event)
    case 'getHistoryStats':
      return await getHistoryStats(event)
    default:
      return {
        success: false,
        error: '未知操作'
      }
  }
}
