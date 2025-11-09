import { MqttClient } from 'mqtt';
import { BaseView } from './base-view';
import logger from 'loglevel';

export class ViewManager {
    private container: HTMLElement;
    private mqtt: MqttClient;
    private views: { [key: string]: BaseView } = {};
    private activeView: BaseView | null = null;
    private modelURL: string | null = null;
    private metadataURL: string | null = null;

    constructor(container: HTMLElement, mqtt: MqttClient) {
        this.container = container;
        this.mqtt = mqtt;
    }

    public addView(name: string, view: BaseView) {
        this.views[name] = view;
    }

    public init() {
        this.mqtt.on('message', (topic, payload) => {
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
            }
        });
    }

    private setActiveView(name: string) {
        if (this.activeView) {
            this.activeView.hide();
        }
        this.activeView = this.views[name];
        if (this.activeView) {
            this.activeView.init();
            this.setModel();
        }
    }

    private setModel() {
        if (this.activeView && this.modelURL && this.metadataURL) {
            this.activeView.setModel(this.modelURL, this.metadataURL);
        }
    }
}
