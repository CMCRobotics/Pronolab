import mqtt, { Client } from 'mqtt';
import { logger } from '../logger';
import { Subject, Observable } from 'rxjs';

export class Session {
    public onTestStatusChanged = new Subject<string>();
    public onPrediction = new Subject<any[]>();
    public onConnect = new Subject<void>();

    private mqtt: Client;
    private model: any;
    private maxPredictions: number;
    private modelURL: string | null = null;
    private metadataURL: string | null = null;
    private testStartTime: number | null = null;
    private testClassName: string | null = null;
    private minConfidence: number | null = null;
    private testDuration: number | null = null;

    private messageSubjects: { [topic: string]: Subject<string> } = {};

    constructor() {
        this.mqtt = mqtt.connect('ws://localhost:9001');
        this.maxPredictions = 0;

        this.onPrediction.subscribe(prediction => {
            this.handlePrediction(prediction);
        });

        this.mqtt.on('connect', () => {
            logger.info('connected to mqtt broker');
            this.onConnect.next();
        });

        this.mqtt.on('message', (topic, payload) => {
            const message = payload.toString();
            if (this.messageSubjects[topic]) {
                this.messageSubjects[topic].next(message);
            }
        });
    }

    public topic(topic: string): Observable<string> {
        if (!this.messageSubjects[topic]) {
            this.messageSubjects[topic] = new Subject<string>();
            this.mqtt.subscribe(topic, { qos: 0 }, (err, granted) => {
                if (err) {
                    logger.error(`Failed to subscribe to topic: ${topic}`, err);
                }
            });
        }
        return this.messageSubjects[topic].asObservable();
    }

    public publish(topic: string, message: string, options?: mqtt.IClientPublishOptions) {
        this.mqtt.publish(topic, message, options);
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
