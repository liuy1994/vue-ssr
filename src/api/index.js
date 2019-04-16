export const fetchItem = new Promise(resolve => {
    setTimeout(() => {
        resolve([1,3,6,3,123,58])
    })
})