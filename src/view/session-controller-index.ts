import { Session } from '../core/session';
import { SessionControllerView } from './session-controller-view';
import mqtt from 'mqtt';
import { logger } from '../logger';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('session-controller-container');
    if (container) {
        const host = window.location.hostname;
        const client = mqtt.connect(`ws://${host}:9001`);
        client.on('connect', () => {
            logger.info('[MQTT] connected');
            const session = new Session(client);
            const view = new SessionControllerView(container, session);
            view.init();
        });
    } else {
        logger.error('Container for session controller not found');
    }
});
