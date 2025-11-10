import { Client } from 'mqtt';
import { logger } from '../logger';
import { Subject } from 'rxjs';

export class Session {
    public onTestStatusChanged = new Subject<string>();
    public onPrediction = new Subject<any[]>();

    private mqtt: Client;
    private model: any;
    private maxPredictions: number;
    private modelURL: string | null = null;
    private metadataURL: string | null = null;
    private testStartTime: number | null = null;
    private testClassName: string | null = null;
    private minConfidence: number | null = null;
    private testDuration: number | null = null;

    constructor(mqtt: Client) {
        this.mqtt = mqtt;
        this.maxPredictions = 0;

        this.onPrediction.subscribe(prediction => {
            this.handlePrediction(prediction);
        });
    }

    public testModel(className: string, minConfidence: number, duration: number) {
        this.testClassName = className;
        this.minConfidence = minConfidence;
        this.testDuration = duration;
        this.testStartTime = Date.now();
        logger.info(`[ModelTest] starting test for class "${className}" with min confidence ${minConfidence} for ${duration}ms`);
        this.onTestStatusChanged.next(`Testing "${this.testClassName}"...`);
    }

    protected handlePrediction(prediction: any[]) {
        if (this.testStartTime && this.testClassName && this.minConfidence && this.testDuration) {
            const classPrediction = prediction.find(p => p.className === this.testClassName);
            if (classPrediction && classPrediction.probability >= this.minConfidence) {
                const elapsedTime = Date.now() - this.testStartTime;
                const remainingTime = Math.max(0, this.testDuration - elapsedTime);
                this.onTestStatusChanged.next(`Testing "${this.testClassName}"... ${Math.ceil(remainingTime / 1000)}s`);

                if (elapsedTime >= this.testDuration) {
                    this.mqtt.publish(`pronolab-server/model-test/success`, 'true');
                    this.testStartTime = null;
                    this.onTestStatusChanged.next('');
                    logger.info(`[ModelTest] success for class "${this.testClassName}"`);
                }
            } else {
                this.testStartTime = Date.now();
                this.onTestStatusChanged.next(`Testing "${this.testClassName}"...`);
            }
        }
    }

    public setModel(modelURL: string, metadataURL: string) {
        this.modelURL = modelURL;
        this.metadataURL = metadataURL;
        // The actual model loading will be handled by the view,
        // as it's a UI-specific operation (e.g., showing a loading indicator).
    }
}
