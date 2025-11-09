import { Client } from 'mqtt';
import { BaseView } from './base-view';

export class DeviceView extends BaseView {
    private form: HTMLFormElement;
    private input: HTMLInputElement;

    constructor(container: HTMLElement, mqtt: Client) {
        super(container, mqtt);

        this.form = document.createElement('form');
        this.form.style.display = 'flex';
        this.form.style.flexDirection = 'column';
        this.form.style.alignItems = 'center';
        this.form.style.justifyContent = 'center';
        this.form.style.height = '100%';

        const label = document.createElement('label');
        label.innerText = 'Enter Device ID:';
        label.style.marginBottom = '10px';
        this.form.appendChild(label);

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.required = true;
        this.input.style.marginBottom = '10px';
        this.form.appendChild(this.input);

        const button = document.createElement('button');
        button.type = 'submit';
        button.innerText = 'Save';
        this.form.appendChild(button);

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    public async init(): Promise<void> {
        this.container.appendChild(this.form);
    }

    public show(): void {
        this.form.style.display = 'flex';
    }

    public hide(): void {
        this.form.style.display = 'none';
    }

    protected async loop(): Promise<void> {
        // Not needed for this view
    }

    protected async loadModel(): Promise<void> {
        // Not needed for this view
    }



    private handleSubmit(event: Event) {
        event.preventDefault();
        const deviceId = this.input.value;
        if (deviceId) {
            localStorage.setItem('deviceId', deviceId);
            window.location.reload();
        }
    }
}
