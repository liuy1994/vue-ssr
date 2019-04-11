const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const Router = require('koa-router')
// 1、webpack配置文件
const webpackConfig = require('@vue/cli-service/webpack.config')
const { createBundleRenderer } = require('vue-server-renderer')
// 2、编译webpack配置文件
const serverCompiler = webpack(webpackConfig)
const mfs = new MemoryFS()
const path = require('path')
const axios = require('axios')
const fs = require('fs')
// 指定输出到的内存流中
serverCompiler.outputFileSystem = mfs
// 3、监听文件修改，实时编译获取最新的 vue-ssr-server-bundle.json
let bundle = null
serverCompiler.watch({}, (err, states) => {
    if(err) throw err
    states = states.toJson()
    states.errors.forEach(error => console.error(error))
    states.warnings.forEach(warning => console.warn(warning))
    const bundlePath = path.join(webpackConfig.output.path, 'vue-ssr-server-bundle.json')
    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
    console.log('new bundle generated!')
})
// 4、获取最新的 vue-ssr-client-manifest.json
const handleRequest = async ctx => {
    console.log(`path: ${ctx.path}`)
    if(!bundle) {
        ctx.body('热更新正在进行中')
        return false
    }
    // 这边的 8080 是 dev server 的端口号
    let result
    try {
        const clientManifestResp = await axios.get('http://localhost:8081/vue-ssr-client-manifest.json')
        const clientManifest = clientManifestResp.data

        const renderer = createBundleRenderer(bundle, {
            runInNewContext: false,
            template: fs.readFileSync(path.resolve(__dirname, '../src/index.template.html'), 'utf-8'),
            clientManifest: clientManifest
        })
        const html = await renderToString(ctx, renderer)
        result = html
    } catch (e) {
        console.log(e)
        result = e
    }

    ctx.body = result
}

const renderToString = (context, renderer) => {
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            err ? reject(err) : resolve(html)
        })
    })
}

const router = new Router()
router.get('*', handleRequest)
module.exports = router