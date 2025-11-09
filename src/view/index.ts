import mqtt from 'mqtt';
import { ViewManager } from './view-manager';
import { ImageView } from './image-view';
import { AudioView } from './audio-view';
import { PoseView } from './pose-view';
import { DeviceView } from './device-view';
import { TeamView } from './team-view';
import { UploadModelView } from './upload-model-view';
import { logger } from '../logger';

const container = document.getElementById('pronolab-container');
if (!container) {
    throw new Error('container not found');
}

const client = mqtt.connect('ws://localhost:9001');

client.on('connect', () => {
    logger.info('connected to mqtt broker');
    const deviceId = localStorage.getItem('deviceId');

    if (deviceId) {
        const deviceIdContainer = document.getElementById('device-id-container');
        if (deviceIdContainer) {
            deviceIdContainer.innerText = deviceId;
        }
        const teamId = localStorage.getItem('teamId');
        if (teamId) {
            showMainView();
        } else {
            showTeamView();
        }
    } else {
        const deviceView = new DeviceView(container, client);
        deviceView.init();
        deviceView.show();
    }
});

function showMainView() {
    const deviceId = localStorage.getItem('deviceId');
    if (container && deviceId) {
        const viewManager = new ViewManager(container, client);
        viewManager.addView('image', new ImageView(container, client));
        viewManager.addView('audio', new AudioView(container, client));
        viewManager.addView('pose', new PoseView(container, client));
        viewManager.addView('upload-model', new UploadModelView(container, client));
        viewManager.init();
        client.subscribe(`homie/terminal-${deviceId}/ui-control/switch/set`);
        client.subscribe(`homie/terminal-${deviceId}/ui-control/model-url/set`);
        client.subscribe(`homie/terminal-${deviceId}/ui-control/metadata-url/set`);
        client.subscribe(`homie/terminal-${deviceId}/ui-control/model-type/set`);
        client.subscribe(`homie/terminal-${deviceId}/ui-control/model-test/set`);

        const uploadButton = document.createElement('button');
        uploadButton.innerText = 'Upload Model';
        uploadButton.onclick = () => {
            viewManager['setActiveView']('upload-model');
        };
        container.appendChild(uploadButton);
    }
}

function showTeamView() {
    if (container) {
        const teamView = new TeamView(container, client, () => {
            showMainView();
        });
        teamView.init();
        teamView.show();
    }
}
