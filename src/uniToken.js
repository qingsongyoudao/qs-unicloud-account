import jwt from 'jsonwebtoken'
import {
  tokenSecret,
  tokenExpiresIn,
  userCollection
} from './config.js'
import {
  log
} from './utils'
import crypto from 'crypto'

function getClientUaHash () {
  const hash = crypto.createHash('md5')
  hash.update(__ctx__.CLIENTUA)
  return hash.digest('hex')
}

const uniToken = {
  createToken: function (user) {
    var token = jwt.sign({
      uid: user._id,
      clientId: getClientUaHash()
    }, tokenSecret, {
      expiresIn: tokenExpiresIn
    })

    return token
  },
  refreshToken: function () {
    // TODO
  },

  checkToken: async function (token) {
    try {
      const payload = jwt.verify(token, tokenSecret)
      console.log(payload)
      if (payload.clientId !== getClientUaHash()) {
        return {
          code: 1302,
          msg: 'token不合法，请重新登录'
        }
      }

      const userInDB = await userCollection.doc(payload.uid).get()

      if (!userInDB.data || userInDB.data.length === 0 || !userInDB.data[0].token || userInDB.data[0].token.indexOf(
        token) === -1) {
        return {
          code: 1302,
          msg: 'token不合法，请重新登录'
        }
      }

      log('checkToken payload', payload)

      return payload
    } catch (err) {
      log('checkToken 3', err)

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
    const tokenExpired = []
    tokenList.forEach(token => {
      try {
        jwt.verify(token, tokenSecret)
      } catch (error) {
        tokenExpired.push(token)
      }
    })
    return tokenExpired
  }
}

export default uniToken
