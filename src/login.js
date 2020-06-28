import encryptPwd from './encryptPwd'
import uniToken from './uniToken'
import { userCollection } from './config'
import { log } from './utils'

const db = uniCloud.database()
async function login ({ username, password, queryField = [] }) {
  const dbCmd = db.command
  const query = []
  if (!queryField || !queryField.length) {
    queryField = ['username']
  }
  const extraCond = {
    email: {
      email_confirmed: 1
    },
    mobile: {
      mobile_confirmed: 1
    }
  }
  queryField.forEach(item => {
    query.push({
      [item]: username,
      ...extraCond[item]
    })
  })
  const userInDB = await userCollection.where(dbCmd.or(...query)).limit(1).get()

  log('userInDB:', userInDB)

  if (userInDB && userInDB.data && userInDB.data.length > 0) {
    const userMatched = userInDB.data[0]
    const pwdInDB = userMatched.password

    if (encryptPwd(password) === pwdInDB) {
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
          last_login_date: new Date().getTime(),
          last_login_ip: __ctx__.CLIENTIP,
          token: tokenList
        })

        log('upRes', upRes)

        return {
          code: 0,
          token: token,
          uid: userMatched._id,
          username: username,
          msg: '登录成功'
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
}

export default login
