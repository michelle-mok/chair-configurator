const PIXEL_RATIO_CAP = 2;

export class Sizes {
    width: number;
    height: number;
    pixelRatio: number;
    private readonly canvas: HTMLCanvasElement;
    private readonly observer: ResizeObserver;
    private readonly onResize: () => void;
    private readonly  sync = (): void => {
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.pixelRatio = Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP);

        this.onResize();
    }

    constructor(canvas: HTMLCanvasElement, onResize: () => void) {
        this.canvas = canvas;
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.pixelRatio = Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP);
        this.onResize = onResize;

        this.observer = new ResizeObserver(() => {
            this.sync();
        });
        this.observer.observe(canvas);
    }

    dispose(): void {
        this.observer.disconnect();
    }
}