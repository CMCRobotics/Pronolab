import mqtt from 'mqtt';
import { ViewManager } from './view-manager';
import { ImageView } from './image-view';
import { AudioView } from './audio-view';
import { PoseView } from './pose-view';
import logger from 'loglevel';

logger.setLevel('debug');

const container = document.getElementById('pronolab-container');
if (!container) {
    throw new Error('container not found');
}

const client = mqtt.connect('ws://localhost:9001');

client.on('connect', () => {
    logger.info('connected to mqtt broker');
    const viewManager = new ViewManager(container, client);
    viewManager.addView('image', new ImageView(container, client));
    viewManager.addView('audio', new AudioView(container, client));
    viewManager.addView('pose', new PoseView(container, client));
    viewManager.init();
    client.subscribe('homie/+/ui-control/switch/set');
    client.subscribe('homie/+/ui-control/model-url/set');
    client.subscribe('homie/+/ui-control/metadata-url/set');
    client.subscribe('homie/+/ui-control/model-type/set');
});
