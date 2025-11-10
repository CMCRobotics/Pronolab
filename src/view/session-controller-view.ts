import { Session } from '../core/session';
import { BaseView } from './base-view';
import { logger } from '../logger';

export class SessionControllerView extends BaseView {
    private deviceId: string | null = null;

    constructor(container: HTMLElement, session: Session) {
        super(container, session);
    }

    public async init(): Promise<void> {
        this.deviceId = localStorage.getItem('deviceId');
        if (!this.deviceId) {
            logger.error('Device ID not found');
            return;
        }

        this.container.innerHTML = `
            <div class="session-controller">
                <h2>Session Controller</h2>
                <div class="controls">
                    <div>
                        <label for="model-type">Model Type:</label>
                        <select id="model-type">
                            <option value="image">Image</option>
                            <option value="audio">Audio</option>
                            <option value="pose">Pose</option>
                        </select>
                        <button id="set-model-type">Set Model Type</button>
                    </div>
                    <div>
                        <button id="switch-to-model-test">Switch to Model Test View</button>
                    </div>
                    <div>
                        <label for="sequence-name">Sequence Name:</label>
                        <input type="text" id="sequence-name" value="default-sequence" />
                        <button id="start-test">Start Test</button>
                    </div>
                </div>
                <div class="results">
                    <h3>Results</h3>
                    <pre id="results-log"></pre>
                </div>
            </div>
        `;

        document.getElementById('set-model-type')?.addEventListener('click', () => this.setModelType());
        document.getElementById('switch-to-model-test')?.addEventListener('click', () => this.switchToModelTest());
        document.getElementById('start-test')?.addEventListener('click', () => this.startTest());

        const mqtt = this.session['mqtt'];
        mqtt.subscribe(`homie/terminal-${this.deviceId}/statistics/prompt-results/log`);
        mqtt.on('message', (topic, payload) => {
            if (topic.endsWith('prompt-results/log')) {
                this.logResult(payload.toString());
            }
        });
    }

    public show(): void {
        this.container.style.display = 'block';
    }

    public hide(): void {
        this.container.style.display = 'none';
    }

    protected async loop(): Promise<void> {
        // No loop needed for this view
    }

    protected async loadModel(): Promise<void> {
        // No model to load in this view
    }

    private setModelType() {
        const modelType = (document.getElementById('model-type') as HTMLSelectElement).value;
        this.session['mqtt'].publish(`homie/terminal-${this.deviceId}/ui-control/model-type/set`, modelType);
        logger.info(`[SessionController] set model type to: ${modelType}`);
    }

    private switchToModelTest() {
        this.session['mqtt'].publish(`homie/terminal-${this.deviceId}/ui-control/switch/set`, 'model-test');
        logger.info(`[SessionController] switched to model-test view`);
    }

    private startTest() {
        const sequenceName = (document.getElementById('sequence-name') as HTMLInputElement).value;
        this.session['mqtt'].publish(`homie/terminal-${this.deviceId}/ui-control/model-test/set`, sequenceName);
        logger.info(`[SessionController] started test sequence: ${sequenceName}`);
    }

    private logResult(result: string) {
        const resultsLog = document.getElementById('results-log');
        if (resultsLog) {
            resultsLog.textContent += result + '\n';
        }
    }
}
