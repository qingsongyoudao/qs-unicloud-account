import encryptPwd from './encryptPwd'
import uniToken from './uniToken'
import {
  userCollection
} from './config'
import {
  log
} from './utils'

const db = uniCloud.database()
const dbCmd = db.command
async function loginByPwd (params) {
  try {
    // 参数
    log('loginBySms -> params', params)

    // 对象
    const model = params.model

    // 检查
    if (model.user && model.user.trim().length === 0) {
      return {
        code: 1101,
        msg: '请输入手机号/邮箱/用户名'
      }
    }
    if (model.password && model.password.trim().length === 0) {
      return {
        code: 1101,
        msg: '请输入密码'
      }
    }

    // 查询条件
    const query = dbCmd.or([{
      userName: model.user
    },
    {
      email: model.user
    },
    {
      mobile: model.user
    }
    ])

    // 获取列表
    const listRes = await userCollection.where(query).limit(1).get()
    log('loginBySms -> listRes', listRes)

    if (listRes && listRes.data && listRes.data.length > 0) {
      const userMatched = listRes.data[0]
      const pwdInDB = userMatched.password
      const userName = userMatched.userName

      if (encryptPwd(model.password) === pwdInDB) {
        try {
          log('过期token清理')
          let tokenList = userMatched.token || []
          const expiredToken = uniToken.getExpiredToken(tokenList)
          tokenList = tokenList.filter(item => {
            return expiredToken.indexOf(item) === -1
          })

          log('开始修改最后登录时间')

          const token = uniToken.createToken(userMatched)
          log('token', token)
          tokenList.push(token)
          const upRes = await userCollection.doc(userMatched._id).update({
            lastLoginDate: new Date().getTime(),
            lastLoginIp: __ctx__.CLIENTIP,
            token: tokenList
          })

          log('upRes', upRes)

          return {
            code: 0,
            msg: '登录成功',
            uid: userMatched._id,
            userName: userName,
            token: token
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
          code: 1102,
          msg: '密码错误'
        }
      }
    } else {
      return {
        code: 1101,
        msg: '用户不存在'
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

export default loginByPwd
