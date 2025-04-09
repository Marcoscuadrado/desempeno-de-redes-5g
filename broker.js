const mosca = require('mosca')


const broker = new mosca.Server({
    port: 9000
})

broker.on('ready', () => {
    console.log('mosca broker on ready')
})

broker.on('clientConnected', (client) => {
    console.log('new client' + client.id)
})

broker.on('published', (package) => {
    console.log(package.payload.toString())
})