import { Client } from 'mqtt';
import { logger } from '../logger';

export abstract class BaseView {
    protected container: HTMLElement;
    private testStatusElement: HTMLElement;
    protected mqtt: Client;
    protected model: any;
    protected maxPredictions: number;
    protected modelURL: string | null = null;
    protected metadataURL: string | null = null;
    private testStartTime: number | null = null;
    private testClassName: string | null = null;
    private minConfidence: number | null = null;
    private testDuration: number | null = null;

    constructor(container: HTMLElement, mqtt: Client) {
        this.container = container;
        this.mqtt = mqtt;
        this.maxPredictions = 0;
        this.testStatusElement = document.createElement('div');
        this.testStatusElement.className = 'test-status';
        this.container.appendChild(this.testStatusElement);
    }

    public abstract init(): Promise<void>;
    public abstract show(): void;
    public abstract hide(): void;
    protected abstract loop(): Promise<void>;

    public testModel(className: string, minConfidence: number, duration: number) {
        this.testClassName = className;
        this.minConfidence = minConfidence;
        this.testDuration = duration;
        this.testStartTime = Date.now();
        logger.info(`[ModelTest] starting test for class "${className}" with min confidence ${minConfidence} for ${duration}ms`);
        this.testStatusElement.style.display = 'block';
    }

    protected handlePrediction(prediction: any[]) {
        if (this.testStartTime && this.testClassName && this.minConfidence && this.testDuration) {
            const classPrediction = prediction.find(p => p.className === this.testClassName);
            if (classPrediction && classPrediction.probability >= this.minConfidence) {
                const elapsedTime = Date.now() - this.testStartTime;
                const remainingTime = Math.max(0, this.testDuration - elapsedTime);
                this.testStatusElement.innerText = `Testing "${this.testClassName}"... ${Math.ceil(remainingTime / 1000)}s`;
                if (elapsedTime >= this.testDuration) {
                    this.mqtt.publish(`pronolab-server/model-test/success`, 'true');
                    this.testStartTime = null;
                    this.testStatusElement.style.display = 'none';
                    logger.info(`[ModelTest] success for class "${this.testClassName}"`);
                }
            } else {
                this.testStartTime = Date.now();
                this.testStatusElement.innerText = `Testing "${this.testClassName}"...`;
            }
        }
    }

    public setModel(modelURL: string, metadataURL: string) {
        this.modelURL = modelURL;
        this.metadataURL = metadataURL;
        this.loadModel();
    }

    protected abstract loadModel(): Promise<void>;

}
