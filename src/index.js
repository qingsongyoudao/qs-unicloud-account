'use strict'

import registerByUserName from './lib/register-by-userName.js'
import registerByEmail from './lib/register-by-email.js'
import registerByMobile from './lib/register-by-mobile.js'
import loginByPwd from './lib/login-by-pwd.js'
import loginBySms from './lib/login-by-sms.js'
import loginByWeixin from './lib/login-by-weixin'
import logout from './lib/logout'
import emptyToken from './lib/empty-token.js'
import setPassword from './lib/set-password.js'
import updatePassword from './lib/update-password.js'
import setUserName from './lib/set-userName.js'
import updateUserName from './lib/update-userName.js'
import bindEmail from './lib/bind-email'
import updateEmail from './lib/update-email.js'
import unbindEmail from './lib/unbind-email.js'
import bindMobile from './lib/bind-mobile'
import updateMobile from './lib/update-mobile.js'
import unbindMobile from './lib/unbind-mobile.js'
import bindWeixin from './lib/bind-weixin'
import unbindWeixin from './lib/unbind-weixin'
import setAvatar from './lib/set-avatar'
import updateUser from './lib/update-user'
import uniToken from './lib/uni-token'
import encryptPwd from './lib/encrypt-pwd'
import resetPwd from './lib/reset-pwd'
import getAccount from './lib/get-account.js'
import getUser from './lib/get-user.js'

const checkToken = uniToken.checkToken

export default {
  registerByUserName,
  registerByEmail,
  registerByMobile,
  loginByPwd,
  loginBySms,
  loginByWeixin,
  logout,
  emptyToken,
  setPassword,
  updatePassword,
  setUserName,
  updateUserName,
  bindEmail,
  updateEmail,
  unbindEmail,
  bindMobile,
  updateMobile,
  unbindMobile,
  bindWeixin,
  unbindWeixin,
  setAvatar,
  updateUser,
  checkToken,
  encryptPwd,
  resetPwd,
  getAccount,
  getUser
}
