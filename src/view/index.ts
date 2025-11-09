import mqtt from 'mqtt';
import { HomieView } from './homie-view';
import logger from 'loglevel';

const container = document.getElementById('pronolab-container');
if (!container) {
    throw new Error('container not found');
}

const client = mqtt.connect('ws://localhost:9001');

client.on('connect', () => {
    logger.info('connected to mqtt broker');
    const view = new HomieView(container, client);
    view.init();
    client.subscribe('homie/+/ui-control/switch/set');
    client.subscribe('homie/+/ui-control/model-url/set');
    client.subscribe('homie/+/ui-control/metadata-url/set');
});
