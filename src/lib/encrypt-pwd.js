import crypto from 'crypto'

import {
  getConfig
} from '../share/index'

function encryptPwd (password) {
  const config = getConfig()
  const hmac = crypto.createHmac('sha1', config.passwordSecret.toString('ascii'))
  hmac.update(password)
  return hmac.digest('hex')
}

export default encryptPwd
