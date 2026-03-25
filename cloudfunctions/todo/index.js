// cloudfunctions/todo/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 获取所有待办
 */
async function getAll(event) {
  const { OPENID } = cloud.getWXContext()
  
  try {
    const res = await db.collection('todos')
      .where({
        _openid: OPENID
      })
      .orderBy('createdAt', 'desc')
      .get()
    
    return {
      success: true,
      data: res.data
    }
  } catch (err) {
    console.error('获取待办失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

/**
 * 添加待办
 */
async function add(event) {
  const { OPENID } = cloud.getWXContext()
  const { data } = event
  
  try {
    const res = await db.collection('todos').add({
      data: {
        ...data,
        _openid: OPENID,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
    
    return {
      success: true,
      id: res._id
    }
  } catch (err) {
    console.error('添加待办失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

/**
 * 更新待办
 */
async function update(event) {
  const { OPENID } = cloud.getWXContext()
  const { id, data } = event
  
  try {
    await db.collection('todos')
      .doc(id)
      .update({
        data: {
          ...data,
          updatedAt: db.serverDate()
        }
      })
    
    return {
      success: true
    }
  } catch (err) {
    console.error('更新待办失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

/**
 * 删除待办
 */
async function remove(event) {
  const { OPENID } = cloud.getWXContext()
  const { id } = event
  
  try {
    await db.collection('todos')
      .doc(id)
      .remove()
    
    return {
      success: true
    }
  } catch (err) {
    console.error('删除待办失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

/**
 * 批量删除待办
 */
async function batchRemove(event) {
  const { OPENID } = cloud.getWXContext()
  const { ids } = event
  
  try {
    const task = db.collection('todos')
      .where({
        _openid: OPENID,
        _id: _.in(ids)
      })
      .remove()
    
    await task
    
    return {
      success: true
    }
  } catch (err) {
    console.error('批量删除失败:', err)
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
    case 'getAll':
      return await getAll(event)
    case 'add':
      return await add(event)
    case 'update':
      return await update(event)
    case 'remove':
      return await remove(event)
    case 'batchRemove':
      return await batchRemove(event)
    default:
      return {
        success: false,
        error: '未知操作'
      }
  }
}
