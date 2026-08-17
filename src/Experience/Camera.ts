import * as THREE from "three";

const FOV = 35;
const START_POSITION = new THREE.Vector3(0, 0, 5);
const NEAR = 0.1;
const FAR = 100;

export class Camera {
    readonly instance: THREE.PerspectiveCamera;

    constructor(aspect: number) {
        this.instance = new THREE.PerspectiveCamera(
            FOV, 
            aspect,
            NEAR,
            FAR
        )
        this.instance.position.copy(START_POSITION);
    }

    resize(aspect: number): void {
        this.instance.aspect = aspect;
        this.instance.updateProjectionMatrix();
    }
}