const Koa = require('Koa')
const app = new Koa()
const path = require('path')
const koaStatic = require('koa-static')

const resolve = file => {
    return path.resolve(__dirname, file)
}

const isDev = process.env.NODE_DEV !== 'production'
const router = isDev ? require('./dev.ssr') : require('./server')

app.use(router.routes()).use(router.allowedMethods())
// 开放dist目录
app.use(koaStatic(resolve('./dist')))
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`server started at localhost:${port}`);
})
module.exports = app