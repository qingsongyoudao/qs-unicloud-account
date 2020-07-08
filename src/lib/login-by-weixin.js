import uniToken from './uni-token'
import {
  userCollection,
  log
} from '../share/index'
import getWeixinApi from '../common/weixin-api'

const db = uniCloud.database()
async function loginByWeixin (code) {
  const clientPlatform = __ctx__.PLATFORM
  const {
    openid,
    unionid
  } = await getWeixinApi()[clientPlatform === 'mp-weixin' ? 'code2Session' : 'getOauthAccessToken'](code)
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
    const userMatched = userList.data[0]
    try {
      log('过期token清理')
      let tokenList = userMatched.token || []
      const expiredToken = uniToken.getExpiredToken(tokenList)
      tokenList = tokenList.filter(item => {
        return expiredToken.indexOf(item) === -1
      })

      log('开始修改最后登录时间，写入unionid（可能不存在）和openid')
      const {
        token,
        tokenExpired
      } = uniToken.createToken(userMatched)
      log('token', token)
      tokenList.push(token)
      const updateData = {
        last_login_date: new Date().getTime(),
        last_login_ip: __ctx__.CLIENTIP,
        token: tokenList,
        wx_openid: {
          [clientPlatform]: openid
        }
      }
      if (unionid) {
        updateData.wx_unionid = unionid
      }
      const upRes = await userCollection.doc(userMatched._id).update(updateData)
      log('upRes', upRes)
      return {
        code: 0,
        token,
        uid: userMatched._id,
        username: userMatched.username,
        msg: '登录成功',
        tokenExpired
      }
    } catch (e) {
      log('写入异常：', e)
      return {
        code: 1104,
        msg: '数据库写入异常'
      }
    }
  } else {
    try {
      const addRes = await userCollection.add({
        register_date: new Date().getTime(),
        register_ip: __ctx__.CLIENTIP,
        wx_openid: {
          [clientPlatform]: openid
        },
        wx_unionid: unionid
      })
      const uid = addRes.id
      const {
        token,
        tokenExpired
      } = uniToken.createToken({
        _id: uid
      })
      await userCollection.doc(uid).update({
        token: [token]
      })
      return {
        code: 0,
        token: token,
        uid: addRes.id,
        msg: '登录成功',
        tokenExpired
      }
    } catch (e) {
      log('写入异常：', e)
      return {
        code: 1104,
        msg: '数据库写入异常'
      }
    }
  }
}

export default loginByWeixin
