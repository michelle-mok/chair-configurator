import * as THREE from 'three';
import type { ChairPartName } from '../config/productConfig';
import type { AssetLoader, ProgressCallback } from './AssetLoader';

// roomEnvironment overexposes at 1.0
const ENVIRONMENT_INTENSITY = 0.5;
const BACKGROUND_COLOR = new THREE.Color(0xfaf9f6);
const MODEL_URL = './models/SheenChair.glb';

export class World {
    readonly instance = new THREE.Scene();
    private readonly disposables: { dispose(): void }[] = [];
    private readonly partMap: Map<ChairPartName, THREE.Mesh>;

    constructor() {
        this.instance.environmentIntensity = ENVIRONMENT_INTENSITY;
        this.instance.background = BACKGROUND_COLOR;
    }

    async load(assetLoader: AssetLoader, onProgress?: ProgressCallback): Promise<void> {
        const gltf = await assetLoader.loadModel(MODEL_URL, onProgress);
        this.instance.add(gltf.scene);
    }

    update(_delta: number): void {
        // contract kept for the conductor
    }

    setEnvironment(texture: THREE.Texture): void {
        this.instance.environment = texture;
    }

    dispose(): void {
        for (const d of this.disposables) d.dispose();
    }
}
