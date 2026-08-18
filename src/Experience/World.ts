import * as THREE from 'three';
import { CHAIR_PART_NAMES, type ChairPartName } from '../config/productConfig';
import type { AssetLoader, ProgressCallback } from './AssetLoader';

// roomEnvironment overexposes at 1.0
const ENVIRONMENT_INTENSITY = 0.5;
const BACKGROUND_COLOR = new THREE.Color(0xfaf9f6);
const MODEL_URL = './models/SheenChair.glb';

export class World {
    readonly instance = new THREE.Scene();
    private readonly disposables: { dispose(): void }[] = [];
    private readonly partMap = new Map<ChairPartName, THREE.Mesh>();

    constructor() {
        this.instance.environmentIntensity = ENVIRONMENT_INTENSITY;
        this.instance.background = BACKGROUND_COLOR;
    }

    async load(assetLoader: AssetLoader, onProgress?: ProgressCallback): Promise<void> {
        const incomingDisposables: { dispose(): void }[] = [];
        const incoming = new Map<ChairPartName, THREE.Mesh>();

        const gltf = await assetLoader.loadModel(MODEL_URL, onProgress);
        gltf.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                if ((CHAIR_PART_NAMES as readonly string[]).includes(object.name)) {
                    incoming.set(object.name as ChairPartName, object);
                    incomingDisposables.push(object.geometry);
                    const materials = Array.isArray(object.material) ? object.material : [object.material];
                    for (const material of materials) incomingDisposables.push(material);
                } else {
                    console.warn(`World: unexpected object "${object.name}"`)
                }
            }
        })

        for (const name of CHAIR_PART_NAMES) {
            if(!incoming.has(name)) {
                throw new Error(`World: expected part missing from model: "${name}"`);
            }
        }

        this.partMap.clear();
        for (const [key, value] of incoming) {
            this.partMap.set(key, value);
        };
        for (const d of incomingDisposables) this.disposables.push(d);

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
