import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type * as THREE from 'three';

const MIN_DISTANCE = 1;
const MAX_DISTANCE = 6;
const TARGET_HEIGHT = 0.35;
const DAMPING_FACTOR = 0.05;
const UNDER_PEEK_ANGLE = Math.PI / 2 + 0.5;

export class Controls {
    private readonly instance: OrbitControls;

    constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
        this.instance = new OrbitControls(camera, canvas);
        this.instance.enableDamping = true;
        this.instance.dampingFactor = DAMPING_FACTOR;
        this.instance.enablePan = false;
        this.instance.minDistance = MIN_DISTANCE;
        this.instance.maxDistance = MAX_DISTANCE;
        this.instance.maxPolarAngle = UNDER_PEEK_ANGLE;
        this.instance.target.set(0, TARGET_HEIGHT, 0);
    }

    update(): void {
        this.instance.update();
    }

    dispose(): void {
        this.instance.dispose();
    }
}
