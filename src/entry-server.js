import { createApp } from "./main"
export default () => {
    return new Promise((resolve, reject) => {
        const { app, router } = createApp()
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
            if(!matchedComponents.length) {
                return reject({
                    code: 404
                })
            }
            resolve(app)
        }, reject)
    })
}