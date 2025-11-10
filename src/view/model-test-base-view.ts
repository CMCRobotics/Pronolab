import { Session } from '../core/session';
import { BaseView } from './base-view';

export abstract class ModelTestBaseView extends BaseView {
    protected labelContainer: HTMLElement | null = null;

    constructor(container: HTMLElement, session: Session) {
        super(container, session);
    }

    public async init(): Promise<void> {
        // Default implementation: empty
        // Subclasses can override if needed.
    }

    public hide(): void {
        // Common logic to clear the container
        this.container.innerHTML = '';
        // Subclasses can override to stop specific resources like webcam or listening
    }

    // Abstract methods that must be implemented by subclasses
    public abstract show(): void;
    protected abstract loop(): Promise<void>;
    protected abstract loadModel(): Promise<void>;

    protected setupLabelContainer() {
        this.labelContainer = document.createElement('div');
        this.container.appendChild(this.labelContainer);
        // Ensure maxPredictions is available, it's inherited from BaseView
        for (let i = 0; i < this.maxPredictions; i++) {
            this.labelContainer.appendChild(document.createElement("div"));
        }
    }

    protected updateLabel(index: number, text: string) {
        if (this.labelContainer && this.labelContainer.childNodes[index]) {
            (this.labelContainer.childNodes[index] as HTMLElement).innerHTML = text;
        }
    }
}
