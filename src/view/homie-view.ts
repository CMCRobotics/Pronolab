import { MqttClient } from 'mqtt';
import logger from 'loglevel';

const tmImage = (window as any).tmImage;

export class HomieView {
    private container: HTMLElement;
    private mqtt: MqttClient;

    private model: any;
    private webcam: any;
    private labelContainer: HTMLElement;
    private maxPredictions: number;
    private modelURL: string | null = null;
    private metadataURL: string | null = null;


    constructor(container: HTMLElement, mqtt: MqttClient) {
        this.container = container;
        this.mqtt = mqtt;
        this.labelContainer = document.createElement('div');
        this.container.appendChild(this.labelContainer);
        this.maxPredictions = 0;
    }

    public async init() {
        this.mqtt.on('message', (topic, payload) => {
            const message = payload.toString();
            logger.info(`[MQTT] message received`, { topic, message });
            if (topic.endsWith('ui-control/switch/set')) {
                this.show(message);
            } else if (topic.endsWith('ui-control/model-url/set')) {
                this.modelURL = message;
                this.loadModel();
            } else if (topic.endsWith('ui-control/metadata-url/set')) {
                this.metadataURL = message;
                this.loadModel();
            }
        });
    }

    private async loadModel() {
        if (this.modelURL && this.metadataURL) {
            this.model = await tmImage.load(this.modelURL, this.metadataURL);
            this.maxPredictions = this.model.getTotalClasses();
        }
    }

    public show(view: string) {
        if (view === 'model-test') {
            this.initWebcam();
        }
    }

    private async initWebcam() {
        if (!this.model) {
            logger.error('model not loaded yet');
            return;
        }
        const flip = true; // whether to flip the webcam
        this.webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await this.webcam.setup(); // request access to the webcam
        await this.webcam.play();
        window.requestAnimationFrame(() => this.loop());

        // append elements to the DOM
        this.container.appendChild(this.webcam.canvas);

        for (let i = 0; i < this.maxPredictions; i++) { // and class labels
            this.labelContainer.appendChild(document.createElement("div"));
        }
    }

    private async loop() {
        this.webcam.update(); // update the webcam frame
        await this.predict();
        window.requestAnimationFrame(() => this.loop());
    }

    private async predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await this.model.predict(this.webcam.canvas);
        for (let i = 0; i < this.maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            (this.labelContainer.childNodes[i] as HTMLElement).innerHTML = classPrediction;
        }
    }
}
