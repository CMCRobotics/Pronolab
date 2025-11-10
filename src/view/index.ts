import { Session } from '../core/session';
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

const session = new Session();

session.onConnect.subscribe(() => {
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
        const deviceView = new DeviceView(container, session);
        deviceView.init();
        deviceView.show();
    }
});

function showMainView() {
    const deviceId = localStorage.getItem('deviceId');
    if (container && deviceId) {
        const viewManager = new ViewManager(container, session);
        viewManager.addView('image', new ImageView(container, session));
        viewManager.addView('audio', new AudioView(container, session));
        viewManager.addView('pose', new PoseView(container, session));
        viewManager.addView('upload-model', new UploadModelView(container, session));
        viewManager.init();

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
        const teamView = new TeamView(container, session, () => {
            showMainView();
        });
        teamView.init();
        teamView.show();
    }
}
