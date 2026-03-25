// cloudfunctions/category/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * 获取所有分类
 */
async function getAll(event) {
  const { OPENID } = cloud.getWXContext()
  
  try {
    // 先获取用户自定义分类
    const userCats = await db.collection('categories')
      .where({
        _openid: OPENID,
        isDefault: false
      })
      .get()
    
    // 如果没有自定义分类，返回默认分类
    if (userCats.data.length === 0) {
      const defaultCategories = [
        { name: '工作', color: '#3498db', icon: 'work' },
        { name: '生活', color: '#2ecc71', icon: 'life' },
        { name: '学习', color: '#9b59b6', icon: 'study' },
        { name: '其他', color: '#95a5a6', icon: 'other' }
      ]
      
      // 初始化默认分类
      const batch = db.batch()
      defaultCategories.forEach(cat => {
        batch.create({
          collection: 'categories',
          data: {
            ...cat,
            _openid: OPENID,
            isDefault: true,
            createdAt: db.serverDate()
          }
        })
      })
      await batch.commit()
      
      return {
        success: true,
        data: defaultCategories.map((cat, i) => ({
          ...cat,
          _id: `default_${i}`
        }))
      }
    }
    
    return {
      success: true,
      data: userCats.data
    }
  } catch (err) {
    console.error('获取分类失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

/**
 * 添加分类
 */
async function add(event) {
  const { OPENID } = cloud.getWXContext()
  const { data } = event
  
  try {
    const res = await db.collection('categories').add({
      data: {
        ...data,
        _openid: OPENID,
        isDefault: false,
        createdAt: db.serverDate()
      }
    })
    
    return {
      success: true,
      id: res._id
    }
  } catch (err) {
    console.error('添加分类失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

/**
 * 更新分类
 */
async function update(event) {
  const { id, data } = event
  
  try {
    await db.collection('categories')
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
    console.error('更新分类失败:', err)
    return {
      success: false,
      error: err.message
    }
  }
}

/**
 * 删除分类
 */
async function remove(event) {
  const { OPENID } = cloud.getWXContext()
  const { id } = event
  
  try {
    const category = await db.collection('categories').doc(id).get()
    
    // 不允许删除默认分类
    if (category.data.isDefault) {
      return {
        success: false,
        error: '不能删除默认分类'
      }
    }
    
    await db.collection('categories')
      .doc(id)
      .remove()
    
    // 将该分类下的待办设为"其他"分类
    const otherCategory = await db.collection('categories')
      .where({
        _openid: OPENID,
        name: '其他'
      })
      .get()
    
    if (otherCategory.data.length > 0) {
      await db.collection('todos')
        .where({
          _openid: OPENID,
          categoryId: id
        })
        .update({
          data: {
            categoryId: otherCategory.data[0]._id
          }
        })
    }
    
    return {
      success: true
    }
  } catch (err) {
    console.error('删除分类失败:', err)
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
    default:
      return {
        success: false,
        error: '未知操作'
      }
  }
}
