import {
  userCollection,
  log
} from '../share/index'

async function unbindEmail (params) {
  // 对象
  const model = {
    id: params.id
  }
  // 数据
  let resData = {}

  const userInDB = await userCollection.doc(model.id).get()

  log('userInDB:', userInDB)

  if (userInDB && userInDB.data && userInDB.data.length > 0) {
    try {
      // 操作
      const upRes = await userCollection.doc(userInDB.data[0]._id).update({
        email: ''
      })

      log('upRes', upRes)

      // 设置数据
      resData = upRes

      // 返回数据给客户端
      return {
        code: 1,
        msg: '解绑成功',
        data: resData
      }
    } catch (e) {
      log('发生异常', e)
      // 返回数据给客户端
      return {
        code: 1104,
        msg: '数据库写入异常'
      }
    }
  } else {
    // 返回数据给客户端
    return {
      code: 1101,
      msg: '用户不存在'
    }
  }
}

export default unbindEmail
