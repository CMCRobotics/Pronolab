import { Session } from '../core/session';
import { BaseView } from './base-view';

export class UploadModelView extends BaseView {
    private iframe: HTMLIFrameElement;

    constructor(container: HTMLElement, session: Session) {
        super(container, session);
        this.iframe = document.createElement('iframe');
        this.iframe.src = 'upload-form.html';
        this.iframe.width = '100%';
        this.iframe.height = '500px';
        this.iframe.style.border = 'none';
    }

    public async init() {
        // Nothing to initialize
    }

    public show() {
        this.container.appendChild(this.iframe);
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
