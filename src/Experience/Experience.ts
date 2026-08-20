import { Sizes } from "./Sizes";
import { World } from "./World";
import { Camera } from "./Camera";
import  { Renderer } from './Renderer';
import { Controls } from "./Controls";
import { Loop } from "./Loop";
import { AssetLoader } from "./AssetLoader";
import { Picker } from "./Picker";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import * as THREE from 'three';
import { ConfiguratorStore } from "../state/ConfiguratorStore";
import { PRODUCT_CATEGORIES, type CategoryId, type ChairPartName } from "../config/productConfig";

export interface ExperienceCallbacks {
    onLoadProgress?: (ratio: number) => void;
    onLoadComplete?: () => void;
    onLoadError?: (error: unknown) => void;
    onHoverPart?: (categoryId: CategoryId | null) => void;
}

export class Experience {
    private readonly sizes: Sizes;
    private readonly world: World;
    private readonly camera: Camera;
    private readonly renderer: Renderer;
    private readonly environmentTarget: THREE.WebGLRenderTarget;
    private readonly controls: Controls;
    private readonly loop: Loop;
    private readonly assetLoader: AssetLoader;
    private readonly picker: Picker;
    readonly store: ConfiguratorStore;
    private unsubscribe: (() => void) | null = null;

    constructor(canvas: HTMLCanvasElement, callbacks: ExperienceCallbacks = {}) {
        this.sizes = new Sizes(() => {
            this.camera.resize(this.sizes.width / this.sizes.height);
            this.renderer.resize(this.sizes);
        });
        this.assetLoader = new AssetLoader();
        this.store = new ConfiguratorStore();
        this.world = new World();
        void this.world
            .load(this.assetLoader, callbacks.onLoadProgress)
            .then(() => {
                this.world.applyConfiguration(this.store.getState());
                this.unsubscribe = this.store.subscribe(() => {
                    this.world.applyConfiguration(this.store.getState());
                })
                callbacks.onLoadComplete?.()

            })
            .catch((error: unknown) => {
                console.error('Experience: model load failed', error);
                callbacks.onLoadError?.(error);
            });
        this.camera = new Camera(this.sizes.width / this.sizes.height);
        this.renderer = new Renderer(canvas, this.sizes);
        this.picker = new Picker(
            this.camera.instance, 
            canvas, 
            () => this.world.getPickableMeshes(),
            (partName) => callbacks.onHoverPart?.(this.categoryForPart(partName)),
            (partName) => {
                const categoryId = this.categoryForPart(partName);
                if (categoryId) {
                    console.log('selected category: ', categoryId);
                }
            }
        );

        const environment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer.instance);
        this.environmentTarget = pmremGenerator.fromScene(environment);
        this.world.setEnvironment(this.environmentTarget.texture);
        environment.dispose();
        pmremGenerator.dispose();

        this.controls = new Controls(this.camera.instance, canvas);
        this.loop = new Loop((delta) => {
            this.world.update(delta);
            this.controls.update();
            this.renderer.instance.render(this.world.instance, this.camera.instance);
        })
    }

    private categoryForPart(partName: ChairPartName | null): CategoryId | null {
        if(!partName) return null;

        const category = PRODUCT_CATEGORIES.find((c) => c.part === partName);

        return category? category.id : null;
    }

    start(): void {
        this.loop.start();
    }

    stop(): void {
        this.loop.stop();
    }

    dispose(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        this.picker.dispose();
        this.loop.dispose();
        this.world.dispose();
        this.assetLoader.dispose();
        this.renderer.dispose();
        this.controls.dispose();
        this.environmentTarget.dispose();
        this.sizes.dispose();
    }
}