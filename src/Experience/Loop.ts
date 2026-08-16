import { Timer } from 'three';

const MAX_DELTA = 1 / 30;

export class Loop {
    private readonly onTick: (delta: number) => void;
    private readonly timer = new Timer();
    private frameHandle: number | null = null;
    private readonly update = (): void => {
        this.timer.update();
        const delta = Math.min(this.timer.getDelta(), MAX_DELTA);
        this.onTick(delta);
        this.frameHandle = requestAnimationFrame(this.update);
    }

    constructor(onTick: (delta: number) => void) {
        this.onTick = onTick;
        this.start();
    }

    start(): void {
        if (this.frameHandle === null) {
            this.frameHandle = requestAnimationFrame(this.update);
        }
    }

    stop(): void {
        if (this.frameHandle !== null) {
            cancelAnimationFrame(this.frameHandle);
            this.frameHandle = null;
        }
    }

    dispose(): void {
        this.stop();
        this.timer.dispose();
    }
    
}