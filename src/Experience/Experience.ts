import { Sizes } from "./Sizes";
import { World } from "./World";
import { Camera } from "./Camera";
import  { Renderer } from './Renderer';
import { Controls } from "./Controls";
import { Loop } from "./Loop";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import * as THREE from 'three';

export class Experience {
    private readonly sizes: Sizes;
    private readonly world: World;
    private readonly camera: Camera;
    private readonly renderer: Renderer;
    private readonly environmentTarget: THREE.WebGLRenderTarget;
    private readonly controls: Controls;
    private readonly loop: Loop;

    constructor(canvas: HTMLCanvasElement) {
        this.sizes = new Sizes(() => {
            this.camera.resize(this.sizes.width / this.sizes.height);
            this.renderer.resize(this.sizes);
        })
        this.world = new World();
        this.camera = new Camera(this.sizes.width / this.sizes.height);
        this.renderer = new Renderer(canvas, this.sizes);

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

    start(): void {
        this.loop.start();
    }

    stop(): void {
        this.loop.stop();
    }

    dispose(): void {
        this.loop.dispose();
        this.world.dispose();
        this.renderer.dispose();
        this.controls.dispose();
        this.environmentTarget.dispose();
        this.sizes.dispose();
    }
}