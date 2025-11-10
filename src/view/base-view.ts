import { Session } from '../core/session';

export abstract class BaseView {
    protected container: HTMLElement;
    private testStatusElement: HTMLElement;
    protected session: Session;
    protected model: any;
    protected maxPredictions: number;
    protected modelURL: string | null = null;
    protected metadataURL: string | null = null;

    constructor(container: HTMLElement, session: Session) {
        this.container = container;
        this.session = session;
        this.maxPredictions = 0;
        this.testStatusElement = document.createElement('div');
        this.testStatusElement.className = 'test-status';
        this.container.appendChild(this.testStatusElement);

        this.session.onTestStatusChanged.subscribe(status => {
            this.testStatusElement.innerText = status;
            this.testStatusElement.style.display = status ? 'block' : 'none';
        });
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
