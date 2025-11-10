import { Client } from 'mqtt';
import { Session } from '../core/session';
import { BaseView } from './base-view';
import { logger } from '../logger';

export class ViewManager {
    private container: HTMLElement;
    private session: Session;
    private views: { [key: string]: BaseView } = {};
    private activeView: BaseView | null = null;
    private modelURL: string | null = null;
    private metadataURL: string | null = null;

    constructor(container: HTMLElement, mqtt: Client) {
        this.container = container;
        this.session = new Session(mqtt);
    }

    public addView(name: string, view: BaseView) {
        this.views[name] = view;
    }

    public init() {
        this.session.onTestStatusChanged.subscribe(status => {
            // The view will handle displaying the status
        });

        this.session.onPrediction.subscribe(prediction => {
            // The session will handle the prediction
        });

        const mqtt = this.session['mqtt'];
        mqtt.on('message', (topic, payload) => {
            const message = payload.toString();
            logger.info(`[MQTT] message received`, { topic, message });
            if (topic.endsWith('ui-control/model-type/set')) {
                this.setActiveView(message);
            } else if (topic.endsWith('ui-control/model-url/set')) {
                this.modelURL = message;
                this.setModel();
            } else if (topic.endsWith('ui-control/metadata-url/set')) {
                this.metadataURL = message;
                this.setModel();
            } else if (topic.endsWith('ui-control/switch/set')) {
                if (this.activeView) {
                    if (message === 'model-test') {
                        this.activeView.show();
                    } else {
                        this.activeView.hide();
                    }
                }
            } else if (topic.endsWith('ui-control/model-test/set')) {
                if (this.activeView) {
                    logger.info(`[ModelTest] received test request: ${message}`);
                    try {
                        const { className, minConfidence, duration } = JSON.parse(message);
                        logger.info(`[ModelTest] triggering test for class "${className}" with min confidence ${minConfidence} for ${duration}ms`);
                        this.session.testModel(className, minConfidence, duration);
                    } catch (e) {
                        logger.error(`[ModelTest] failed to parse test request: ${e}`);
                    }
                }
            }
        });
    }

    private setActiveView(name: string) {
        if (this.activeView) {
            this.activeView.hide();
        }
        this.activeView = this.views[name];
        if (this.activeView) {
            this.container.style.display = 'block';
            this.activeView.init();
            this.activeView.show();
            if (name !== 'upload-model' && name !== 'session-controller') {
                this.setModel();
            }
        }
    }

    private setModel() {
        if (this.activeView && this.modelURL && this.metadataURL) {
            this.activeView.setModel(this.modelURL, this.metadataURL);
        }
    }
}
