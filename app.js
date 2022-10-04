const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const BaseFramework = require('@galenjs/framework-next')
const compose = require('koa-compose')

const config = require('./config')

class Framework extends BaseFramework {
  async afterInit () {
    await super.afterInit()
    this.app.use(compose([
      koaBody({}),
      bodyParser()
    ]))
    this.loadMiddleware([
      'timing',
      'requestLog',
      'errorHandler',
      'cors',
      'router'
    ])
  }

  async beforeClose () {
    this.schedule.softExit()
    this.amqp.softExit()
  }
}

const bootstrap = async () => {
  const framework = new Framework(config)
  await framework.init()
  await framework.start()
}

bootstrap()
