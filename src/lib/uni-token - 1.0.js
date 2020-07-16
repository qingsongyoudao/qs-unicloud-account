import jwt from 'jsonwebtoken'
import {
  getConfig,
  userCollection,
  log
} from '../share/index'
import crypto from 'crypto'

function getClientUaHash () {
  const hash = crypto.createHash('md5')
  hash.update(__ctx__.CLIENTUA)
  return hash.digest('hex')
}

const uniToken = {
  createToken: function (user) {
    const config = getConfig()
    const token = jwt.sign({
      uid: user._id,
      clientId: getClientUaHash()
    }, config.tokenSecret, {
      expiresIn: config.tokenExpiresIn
    })

    return {
      token,
      tokenExpired: Date.now() + config.tokenExpiresIn * 1000
    }
  },
  refreshToken: function () {
    // TODO
  },

  checkToken: async function (token) {
    const config = getConfig()
    try {
      const payload = jwt.verify(token, config.tokenSecret)
      console.log(payload)
      if (payload.clientId !== getClientUaHash()) {
        return {
          code: 1302,
          msg: 'token不合法，请重新登录'
        }
      }

      const userInDB = await userCollection.doc(payload.uid).get()

      if (!userInDB.data || userInDB.data.length === 0 || !userInDB.data[0].token) {
        return {
          code: 1302,
          msg: 'token不合法，请重新登录'
        }
      }
      let tokenList = userInDB.data[0].token
      if (typeof tokenInDb === 'string') {
        tokenList = [tokenList]
      }
      if (tokenList.indexOf(token) === -1) {
        return {
          code: 1302,
          msg: 'token不合法，请重新登录'
        }
      }

      log('checkToken payload', payload)

      return payload
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return {
          code: 1301,
          msg: 'token已过期，请重新登录',
          err: err
        }
      }

      return {
        code: 1302,
        msg: '非法token',
        err: err
      }
    }
  },
  getExpiredToken (tokenList) {
    const config = getConfig()
    const tokenExpired = []
    tokenList.forEach(token => {
      try {
        jwt.verify(token, config.tokenSecret)
      } catch (error) {
        tokenExpired.push(token)
      }
    })
    return tokenExpired
  }
}

export default uniToken
