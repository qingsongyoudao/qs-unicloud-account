import {
  userCollection,
  log
} from '../share/index'
import getWeixinApi from '../common/weixin-api'

const db = uniCloud.database()
async function bindWeixin (params) {
  // 对象
  const model = {
    id: params.id,
    code: params.code
  }
  // 数据
  let resData = {}

  const clientPlatform = __ctx__.PLATFORM
  const {
    openid,
    unionid
  } = await getWeixinApi()[clientPlatform === 'mp-weixin' ? 'code2Session' : 'getOauthAccessToken'](model.code)
  if (!openid) {
    throw new Error('获取openid失败')
  }
  const dbCmd = db.command
  const queryUser = [{
    wx_openid: {
      [clientPlatform]: openid
    }
  }]
  if (unionid) {
    queryUser.push({
      wx_unionid: unionid
    })
  }
  const userList = await userCollection.where(dbCmd.or(...queryUser)).get()
  // openid 或 unionid已注册
  if (userList && userList.data && userList.data.length > 0) {
    return {
      code: 1101,
      msg: '微信绑定失败，此微信账号已被绑定'
    }
  }
  try {
    const updateData = {
      wx_openid: {
        [clientPlatform]: openid
      }
    }
    if (unionid) {
      updateData.wx_unionid = unionid
    }
    const upRes = await userCollection.doc(model.id).update(updateData)

    // 设置数据
    resData = upRes

    if (upRes.updated === 1) {
      return {
        code: 1,
        msg: '绑定成功',
        data: resData
      }
    } else {
      return {
        code: 1102,
        msg: '微信绑定失败，请稍后再试',
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

export default bindWeixin
