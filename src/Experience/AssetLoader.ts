import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const DRACO_DECODER_PATH = '/draco/';
export type ProgressCallback = (ratio: number) => void;

export class AssetLoader {
    private readonly gltfLoader: GLTFLoader;
    private readonly dracoLoader: DRACOLoader;

    constructor() {
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
    }

    loadModel(url: string, onProgress?: ProgressCallback): Promise<GLTF> {
        return this.gltfLoader.loadAsync(url, (event) => {
            if(onProgress && event.lengthComputable) {
                onProgress(event.loaded / event.total);
            }
        })
    }

    dispose(): void {
        this.dracoLoader.dispose();
    }
}