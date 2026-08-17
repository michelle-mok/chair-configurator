import * as THREE from 'three';

// roomEnvironment overexposes at 1.0
const ENVIRONMENT_INTENSITY = 0.5;
const BACKGROUND_COLOR = new THREE.Color(0xfaf9f6);

export class World {
    readonly instance = new THREE.Scene();
    private readonly disposables: { dispose(): void }[] = [];

    constructor() {
        this.instance.environmentIntensity = ENVIRONMENT_INTENSITY;
        this.instance.background = BACKGROUND_COLOR;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.disposables.push(geometry, material);

        const cube = new THREE.Mesh(geometry, material);
        this.instance.add(cube);
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
