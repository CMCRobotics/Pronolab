import * as tmImage from '@teachablemachine/image';
import { Session } from '../core/session';
import { BaseView } from './base-view';
import { logger } from '../logger';

export class ImageView extends BaseView {
    private webcam: any;
    private labelContainer: HTMLElement | null = null;

    constructor(container: HTMLElement, session: Session) {
        super(container, session);
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

        // append elements to the DOM before playing
        this.container.appendChild(this.webcam.canvas);
        
        await this.webcam.play();
        window.requestAnimationFrame(() => this.loop());

        this.labelContainer = document.createElement('div');
        this.container.appendChild(this.labelContainer);

        for (let i = 0; i < this.maxPredictions; i++) { // and class labels
            this.labelContainer.appendChild(document.createElement("div"));
        }
    }

    private async predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await this.model.predict(this.webcam.canvas);
        this.session.onPrediction.next(prediction);
        if (this.labelContainer) {
            for (let i = 0; i < this.maxPredictions; i++) {
                const classPrediction =
                    prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                (this.labelContainer.childNodes[i] as HTMLElement).innerHTML = classPrediction;
            }
        }
    }
}
