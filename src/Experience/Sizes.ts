const PIXEL_RATIO_CAP = 2;

export class Sizes {
    width: number;
    height: number;
    pixelRatio: number;
    private readonly onResize: () => void;
    private readonly  sync = (): void => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP);

        this.onResize();
    }

    constructor(onResize: () => void) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP);
        this.onResize = onResize;

        window.addEventListener('resize', this.sync);
    }

    dispose(): void {
        window.removeEventListener('resize', this.sync);
    }
}