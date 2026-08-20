import * as THREE from 'three';
import { CHAIR_PART_NAMES, PRODUCT_CATEGORIES, type ChairPartName, type OptionId } from '../config/productConfig';
import type { AssetLoader, ProgressCallback } from './AssetLoader';
import type { ConfiguratorState } from '../state/ConfiguratorStore';

// roomEnvironment overexposes at 1.0
const ENVIRONMENT_INTENSITY = 0.5;
const BACKGROUND_COLOR = new THREE.Color(0xfaf9f6);
const MODEL_URL = '/models/SheenChair.glb';
const CHAIR_SHADOW_URL = '/textures/chair-shadow.png';
const PLANE_SIZE = 3;
const Y_OFFSET = 0.001;

export class World {
    readonly instance = new THREE.Scene();
    private readonly disposables: { dispose(): void }[] = [];
    private readonly partMap = new Map<ChairPartName, THREE.Mesh>();
    private readonly optionMaterials = new Map<OptionId, THREE.Material>();

    constructor() {
        this.instance.environmentIntensity = ENVIRONMENT_INTENSITY;
        this.instance.background = BACKGROUND_COLOR;

        const textureLoader = new THREE.TextureLoader();
        const shadowTexture = textureLoader.load(CHAIR_SHADOW_URL);

        const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            alphaMap: shadowTexture,
            transparent: true,
            depthWrite: false
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = Y_OFFSET;
        this.instance.add(plane);
        this.disposables.push(geometry, material, shadowTexture);
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
        this.buildOptionMaterials(incomingDisposables);
        for (const d of incomingDisposables) this.disposables.push(d);
        this.instance.add(gltf.scene);
    }

    private buildOptionMaterials(disposables: { dispose(): void }[]): void {
        this.optionMaterials.clear();

        for (const category of PRODUCT_CATEGORIES) {
            const mesh = this.partMap.get(category.part);

            if(!mesh) continue;
                
            const template = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
            for (const option of category.options) {
                const material = template.clone();
                if ('color' in material && material.color instanceof THREE.Color) {
                    material.color.set(option.color);
                }
                if ('map' in material) material.map = null;
                if ('sheenColor' in material && material.sheenColor instanceof THREE.Color) {
                    material.sheenColor.set(option.color);
                }
                this.optionMaterials.set(option.id, material);
                disposables.push(material);
            }
        }
    }

    update(_delta: number): void {
        // contract kept for the conductor
    }

    setEnvironment(texture: THREE.Texture): void {
        this.instance.environment = texture;
    }

    applyConfiguration(state: Readonly<ConfiguratorState>): void {
        for (const category of PRODUCT_CATEGORIES) {
            
            const mesh = this.partMap.get(category.part);
            if(!mesh) continue;

            const selectedOptionId = state[category.id];
            const material = this.optionMaterials.get(selectedOptionId);
            if(!material) continue;

            mesh.material = material;
        }
    }

    getPickableMeshes(): THREE.Mesh[] {
        return [...this.partMap.values()];
    }

    dispose(): void {
        for (const d of this.disposables) d.dispose();
    }
}
