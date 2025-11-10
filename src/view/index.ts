import mqtt from 'mqtt';
import { Session } from '../core/session';
import { ViewManager } from './view-manager';
import { ImageView } from './image-view';
import { AudioView } from './audio-view';
import { PoseView } from './pose-view';
import { DeviceView } from './device-view';
import { TeamView } from './team-view';
import { UploadModelView } from './upload-model-view';
import { SessionControllerView } from './session-controller-view';
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
        const session = new Session(client);
        const deviceView = new DeviceView(container, session);
        deviceView.init();
        deviceView.show();
    }
});

function showMainView() {
    const deviceId = localStorage.getItem('deviceId');
    if (container && deviceId) {
        const viewManager = new ViewManager(container, client);
        const session = viewManager['session'];
        viewManager.addView('image', new ImageView(container, session));
        viewManager.addView('audio', new AudioView(container, session));
        viewManager.addView('pose', new PoseView(container, session));
        viewManager.addView('upload-model', new UploadModelView(container, session));
        viewManager.addView('session-controller', new SessionControllerView(container, session));
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

        const sessionControllerButton = document.createElement('button');
        sessionControllerButton.innerText = 'Session Controller';
        sessionControllerButton.onclick = () => {
            viewManager['setActiveView']('session-controller');
        };
        container.appendChild(sessionControllerButton);
    }
}

function showTeamView() {
    if (container) {
        const session = new Session(client);
        const teamView = new TeamView(container, session, () => {
            showMainView();
        });
        teamView.init();
        teamView.show();
    }
}
