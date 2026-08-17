import type { Sizes } from './Sizes';
import * as THREE from 'three';

export class Renderer {
    readonly instance: THREE.WebGLRenderer;

    constructor(canvas: HTMLCanvasElement, sizes: Sizes) {
        this.instance = new THREE.WebGLRenderer({ canvas });
        this.instance.setPixelRatio(sizes.pixelRatio);
        this.instance.setSize(sizes.width, sizes.height);
        this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    }

    resize(sizes: Sizes): void {
        this.instance.setPixelRatio(sizes.pixelRatio);
        this.instance.setSize(sizes.width, sizes.height);
    }

    dispose(): void {
        this.instance.dispose();
    }
}
