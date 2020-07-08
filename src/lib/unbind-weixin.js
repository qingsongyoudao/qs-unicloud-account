import {
  userCollection,
  log
} from '../share/index'

const db = uniCloud.database()
async function unbindWeixin (params) {
  // 对象
  const model = {
    id: params.id
  }
  // 数据
  let resData = {}
  try {
    const dbCmd = db.command
    const upRes = await userCollection.doc(model.id).update({
      wx_openid: dbCmd.remove(),
      wx_unionid: dbCmd.remove()
    })
    log('upRes:', upRes)

    // 设置数据
    resData = upRes

    if (upRes.updated === 1) {
      return {
        code: 0,
        msg: '微信解绑成功',
        data: resData
      }
    } else {
      return {
        code: 1102,
        msg: '微信解绑失败，请稍后再试',
        data: resData
      }
    }
  } catch (e) {
    log('写入异常：', e)
    return {
      code: 1104,
      msg: '数据库写入异常'
    }
  }
}

export default unbindWeixin
