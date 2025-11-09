import { MqttClient } from 'mqtt';
import { BaseView } from './base-view';
import logger from 'loglevel';

const tmImage = (window as any).tmImage;

export class ImageView extends BaseView {
    private webcam: any;
    private labelContainer: HTMLElement;

    constructor(container: HTMLElement, mqtt: MqttClient) {
        super(container, mqtt);
        this.labelContainer = document.createElement('div');
        this.container.appendChild(this.labelContainer);
    }

    public async init() {
        // empty for now
    }

    public show() {
        this.initWebcam();
    }

    public hide() {
        if (this.webcam) {
            this.webcam.stop();
        }
        this.container.innerHTML = '';
    }

    protected async loadModel() {
        if (this.modelURL && this.metadataURL) {
            logger.debug(`loading model from ${this.modelURL} and ${this.metadataURL}`);
            this.model = await tmImage.load(this.modelURL, this.metadataURL);
            this.maxPredictions = this.model.getTotalClasses();
            logger.debug(`model loaded with ${this.maxPredictions} classes`);
        }
    }

    protected async loop() {
        this.webcam.update(); // update the webcam frame
        await this.predict();
        window.requestAnimationFrame(() => this.loop());
    }

    private async initWebcam() {
        if (!this.model) {
            logger.error('model not loaded yet');
            return;
        }
        logger.debug('initializing webcam');
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
