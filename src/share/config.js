import fs from 'fs'
import path from 'path'

const db = uniCloud.database()
const userCollection = db.collection('user')

// 导出方法防止示例复用带来的问题
function getConfig () {
  let config = {}

  try {
    config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json')))
    Object.assign(config, config[__ctx__.PLATFORM])
    const argsRequired = ['passwordSecret', 'tokenSecret', 'tokenExpiresIn']
    argsRequired.forEach((item) => {
      if (!config || !config[item]) {
        throw new Error(`请在公用模块uni-id的config.json内添加配置项：${item}`)
      }
    })
  } catch (error) {
    throw new Error('请在公用模块uni-id内添加config.json配置必要参数')
  }
  return config
}

export {
  userCollection,
  getConfig
}
