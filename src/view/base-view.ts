import { MqttClient } from 'mqtt';
import logger from 'loglevel';

export abstract class BaseView {
    protected container: HTMLElement;
    protected mqtt: MqttClient;
    protected model: any;
    protected maxPredictions: number;
    protected modelURL: string | null = null;
    protected metadataURL: string | null = null;

    constructor(container: HTMLElement, mqtt: MqttClient) {
        this.container = container;
        this.mqtt = mqtt;
        this.maxPredictions = 0;
    }

    public abstract init(): Promise<void>;
    public abstract show(): void;
    public abstract hide(): void;
    protected abstract loop(): Promise<void>;

    public setModel(modelURL: string, metadataURL: string) {
        this.modelURL = modelURL;
        this.metadataURL = metadataURL;
        this.loadModel();
    }

    protected abstract loadModel(): Promise<void>;

}
