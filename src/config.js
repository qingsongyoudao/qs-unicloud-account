import fs from 'fs'
import path from 'path'

const db = uniCloud.database()
const userCollection = db.collection('uni-id-users')
let passwordSecret, tokenSecret, tokenExpiresIn

try {
  const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json')))
  Object.assign(config, config[__ctx__.PLATFORM])
  const argsRequired = ['passwordSecret', 'tokenSecret', 'tokenExpiresIn']
  argsRequired.forEach((item) => {
    if (!config || !config[item]) {
      throw new Error(`请在公用模块uni-id的config.json内添加配置项：${item}`)
    }
  })
  passwordSecret = config.passwordSecret
  tokenSecret = config.tokenSecret
  tokenExpiresIn = config.tokenExpiresIn
} catch (error) {
  throw new Error('请在公用模块uni-id内添加config.json配置必要参数')
}

export {
  userCollection,
  passwordSecret,
  tokenSecret,
  tokenExpiresIn
}
