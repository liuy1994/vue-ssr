const Koa = require('Koa')
const app = new Koa()
const fs = require('fs')
const path = require('path')
const koaStatic = require('koa-static')

const resolve = file => {
   return path.resolve(__dirname, file)
}

// 开放dist目录
app.use(koaStatic(resolve('./dist')))

// 获得一个createBundleRenderer
const { createBundleRenderer } = require('vue-server-renderer')
const bundle = require('./dist/vue-ssr-server-bundle')
const clientManifest = require('./dist/vue-ssr-client-manifest')
const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: fs.readFileSync(resolve('./src/index.template.html'), 'utf-8'),
    clientManifest: clientManifest
})

const renderToString = context => {
    return new Promise((resolve1, reject) => {
        renderer.renderToString(context, (err, html) => {
            err ? reject(err) : resolve(html)
        })
    })
}

// 添加一个中间件来处理所有请求
app.use(async (ctx, next) => {
    const context = {
        title: 'ssr test',
        url: ctx.url
    }
    const html = await renderToString(context)
    ctx.body = html
    next()
})

const port = 3000
app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})
