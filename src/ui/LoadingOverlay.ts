const PERCENT_SCALE = 100;

export class LoadingOverlay {
    private readonly root: HTMLDivElement;
    private readonly label: HTMLParagraphElement;
    private readonly bar: HTMLDivElement;
    private readonly fill: HTMLDivElement;

    constructor(parent: HTMLElement) {
        this.root = document.createElement('div');
        this.root.className = 'loading-overlay';
        parent.appendChild(this.root);

        this.label = document.createElement('p');
        this.label.className = 'loading-overlay__label';
        this.label.textContent = 'Loading. . .';
        this.root.appendChild(this.label);

        this.bar = document.createElement('div');
        this.bar.className = 'loading-overlay__bar';
        this.root.appendChild(this.bar);

        this.fill = document.createElement('div');
        this.fill.className = 'loading-overlay__fill';
        this.bar.appendChild(this.fill);
    }

    setProgress(ratio: number): void {
        const percent = Math.round(ratio * PERCENT_SCALE)
        Math.round(ratio * PERCENT_SCALE);
        this.label.textContent = `${percent}%`;
        this.fill.style.width = `${percent}%`;
    }

    showError(message: string): void {
        this.label.textContent = message;
        this.bar.style.display = 'none';
    }

    dispose(): void {
        this.root.remove();
    }
}