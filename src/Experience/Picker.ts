import * as THREE from 'three';
import { CHAIR_PART_NAMES, type ChairPartName } from '../config/productConfig';

export class Picker {
    private readonly camera: THREE.PerspectiveCamera;
    private readonly canvas: HTMLCanvasElement;
    private readonly getMeshes: () => THREE.Mesh[];
    private readonly onHover: (partName: ChairPartName | null) => void;
    private readonly onSelect: (partName: ChairPartName) => void;
    private readonly raycaster = new THREE.Raycaster();
    private readonly pointer = new THREE.Vector2(0, 0);
    private readonly onPointerMove = (event: PointerEvent): void => {
        const chairPartName = this.getPartName(event);
        this.onHover(chairPartName);
    }
    private readonly onClick = (event: PointerEvent): void => {
        const chairPartName = this.getPartName(event);
        if (chairPartName) {
            this.onSelect(chairPartName);
        }
    }

    constructor(
        camera: THREE.PerspectiveCamera, 
        canvas: HTMLCanvasElement,
        getMeshes: () => THREE.Mesh[],
        onHover: (partName: ChairPartName | null) => void,
        onSelect: (partName: ChairPartName) => void
    ) {
        this.camera = camera;
        this.canvas = canvas;
        this.onHover = onHover;
        this.onSelect = onSelect;
        this.getMeshes = getMeshes;
        
        canvas.addEventListener('pointermove', this.onPointerMove);
        canvas.addEventListener('click', this.onClick);
    }

    private getPartName(event: PointerEvent): (ChairPartName | null) {
        const rect = this.canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.pointer.set(x, y);
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersectionArray = this.raycaster.intersectObjects(this.getMeshes());
        const hit = intersectionArray[0];
        if(hit && (CHAIR_PART_NAMES as readonly string[]).includes(hit.object.name)) {
            return hit.object.name as ChairPartName;
        } else {
            return null;
        }
    }

    dispose(): void {
        this.canvas.removeEventListener('pointermove', this.onPointerMove);
        this.canvas.removeEventListener('click', this.onClick);
    }
}