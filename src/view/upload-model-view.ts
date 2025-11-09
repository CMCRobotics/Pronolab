import { Client } from 'mqtt';
import { BaseView } from './base-view';
import { logger } from '../logger';

export class UploadModelView extends BaseView {
    constructor(container: HTMLElement, mqtt: Client) {
        super(container, mqtt);
    }

    public async init() {
        // Nothing to initialize
    }

    public show() {
        this.container.innerHTML = '';
        const title = document.createElement('h1');
        title.innerText = 'Upload Teachable Machine Model';
        this.container.appendChild(title);

        const form = document.createElement('form');
        form.enctype = 'multipart/form-data';
        form.method = 'post';
        form.action = '/upload-model';

        const nameLabel = document.createElement('label');
        nameLabel.innerText = 'Model Name:';
        form.appendChild(nameLabel);

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'modelName';
        nameInput.required = true;
        form.appendChild(nameInput);

        form.appendChild(document.createElement('br'));

        const modelLabel = document.createElement('label');
        modelLabel.innerText = 'Model Archive (.zip):';
        form.appendChild(modelLabel);

        const modelInput = document.createElement('input');
        modelInput.type = 'file';
        modelInput.name = 'modelArchive';
        modelInput.accept = '.zip,application/zip,application/x-zip,application/x-zip-compressed';
        modelInput.required = true;
        form.appendChild(modelInput);

        form.appendChild(document.createElement('br'));

        const teamId = localStorage.getItem('teamId');
        if (teamId) {
            const teamIdInput = document.createElement('input');
            teamIdInput.type = 'hidden';
            teamIdInput.name = 'teamId';
            teamIdInput.value = teamId;
            form.appendChild(teamIdInput);
        }

        const deviceId = localStorage.getItem('deviceId');
        if (deviceId) {
            const deviceIdInput = document.createElement('input');
            deviceIdInput.type = 'hidden';
            deviceIdInput.name = 'deviceId';
            deviceIdInput.value = deviceId;
            form.appendChild(deviceIdInput);
        }

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.innerText = 'Upload';
        form.appendChild(submitButton);

        this.container.appendChild(form);
    }

    public hide() {
        this.container.innerHTML = '';
    }

    protected async loop() {
        // Not needed for this view
    }

    protected async loadModel() {
        // Not needed for this view
    }
}
