const mqtt = require('mqtt');


const sub = mqtt.connect('mqtt://localhost:9000');

sub.on('connect', () => {
    sub.subscribe('topic test')
})

sub.on('message', (topic, message) =>{
    console.log(message.toString())
})