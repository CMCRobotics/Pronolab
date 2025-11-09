const mqtt = require('mqtt');

const client = mqtt.connect('ws://localhost:9001');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    console.log('Publishing teams...');
    client.publish('homie/Gateway/team-blue/name', 'Blue');
    client.publish('homie/Gateway/team-red/name', 'Red');
    client.publish('homie/Gateway/team-white/name', 'White');
    client.publish('homie/Gateway/team-blue/id', 'blue');
    client.publish('homie/Gateway/team-red/id', 'red');
    client.publish('homie/Gateway/team-white/id', 'white');
    console.log('Done.');
    client.end();
});
