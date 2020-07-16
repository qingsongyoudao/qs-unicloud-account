import uniToken from './uni-token'
import {
  userCollection,
  log
} from '../share/index'

async function loginBySms (params) {
  try {
    // 对象
    const model = {
      mobile: params.mobile,
      loginCounts: 0,
      lastLoginDate: '',
      lastLoginIp: '',
      lastLoginPlatform: ''
    }
    // 数据
    let data = {}

    // 检查
    if (model.mobile && model.mobile.trim().length === 0) {
      return {
        code: 1101,
        msg: '请输入手机号'
      }
    }
    if (params.verifyCode.toString() !== params.codeId.toString()) {
      return {
        code: 1101,
        msg: '验证码不正确'
      }
    }

    // 查询条件
    const query = {
      mobile: model.mobile
    }

    // 获取列表
    const listRes = await userCollection.where(query).limit(1).get()
    log('loginBySms -> listRes', listRes)

    if (listRes && listRes.data && listRes.data.length > 0) {
      const userMatched = listRes.data[0]
      const userName = userMatched.userName
      if (userMatched.loginCounts) {
        model.loginCounts = userMatched.loginCounts
      }

      try {
        log('过期token清理')
        let tokenList = userMatched.token || []
        // 兼容旧版逻辑
        if (typeof tokenList === 'string') {
          tokenList = [tokenList]
        }
        const expiredToken = uniToken.getExpiredToken(tokenList)
        tokenList = tokenList.filter(item => {
          return expiredToken.indexOf(item) === -1
        })

        log('开始修改最后登录时间')

        const {
          token,
          tokenExpired
        } = uniToken.createToken(userMatched)
        log('token', token)
        tokenList.push(token)

        // 设置
        model.loginCounts = model.loginCounts + 1
        model.lastLoginDate = new Date().getTime()
        model.lastLoginIp = __ctx__.CLIENTIP
        model.regPlatform = ''

        const upRes = await userCollection.doc(userMatched._id).update({
          loginCounts: model.loginCounts,
          lastLoginDate: model.lastLoginDate,
          lastLoginIp: model.lastLoginIp,
          lastLoginPlatform: model.lastLoginPlatform,
          token: tokenList
        })

        log('upRes', upRes)

        // 设置数据
        data = {
          uid: userMatched._id,
          username: userName,
          token,
          tokenExpired
        }

        return {
          code: 1,
          msg: '登录成功',
          data: data
        }
      } catch (e) {
        log('写入异常：', e)
        return {
          code: 1104,
          msg: '数据库写入异常'
        }
      }
    } else {
      return {
        code: 1101,
        msg: '手机号不正确'
      }
    }
  } catch (e) {
    log('发生异常', e)
    // 返回数据给客户端
    return {
      code: 1104,
      msg: '数据库写入异常'
    }
  }
}

export default loginBySms
