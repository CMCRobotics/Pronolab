import * as tmAudio from '@tensorflow-models/speech-commands';
import { MqttClient } from 'mqtt';
import { BaseView } from './base-view';
import logger from 'loglevel';

export class AudioView extends BaseView {
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
        this.startListening();
    }

    public hide() {
        if (this.model) {
            this.model.stopListening();
        }
        this.container.innerHTML = '';
    }

    protected async loadModel() {
        if (this.modelURL && this.metadataURL) {
            logger.debug(`loading model from ${this.modelURL} and ${this.metadataURL}`);
            this.model = await tmAudio.create('BROWSER_FFT');
            this.maxPredictions = this.model.getTotalClasses();
            logger.debug(`model loaded with ${this.maxPredictions} classes`);
        }
    }

    protected async loop() {
        // audio loop is handled by the library
    }

    private async startListening() {
        if (!this.model) {
            logger.error('model not loaded yet');
            return;
        }
        logger.debug('start listening');
        this.model.listen((result: { scores: { className: string, score: number }[] }) => {
            for (let i = 0; i < this.maxPredictions; i++) {
                const classPrediction =
                    result.scores[i].className + ": " + result.scores[i].score.toFixed(2);
                (this.labelContainer.childNodes[i] as HTMLElement).innerHTML = classPrediction;
            }
        });
    }

    private get metadata(): { words: string[] } {
        // a bit of a hack to get the metadata from the URL
        const metadata: { words: string[] } = {
            words: []
        };
        try {
            const url = new URL(this.metadataURL!);
            const words = url.searchParams.get('words');
            if (words) {
                metadata.words = words.split(',');
            }
        } catch (e) {
            logger.error(e);
        }
        return metadata;
    }
}
