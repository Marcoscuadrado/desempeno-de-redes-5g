const mqtt = require('mqtt');
const { SerialPort, ReadlineParser } = require('serialport'); 

const port = new SerialPort({
    path: 'COM6', // Cambiar 'COM6' a 'path'
    baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' })); // Usar ReadlineParser

const pub = mqtt.connect('mqtt://localhost:9000');

pub.on('connect', () => {
    parser.on('data', (data) => {
        console.log("Datos recibidos:", data);
        pub.publish('topic test', data);
    });
});
