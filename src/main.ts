import { Experience } from "./Experience/Experience";
import { LoadingOverlay } from "./ui/LoadingOverlay";
import { ConfiguratorPanel } from "./ui/ConfiguratorPanel";

const canvas = document.querySelector<HTMLCanvasElement>('#webgl');
if (!canvas) throw new Error('canvas #webgl not found');

const overlay = new LoadingOverlay(document.body);

const experience = new Experience(canvas, {
    onLoadProgress: (ratio) => overlay.setProgress(ratio),
    onLoadComplete: () => overlay.dispose(),
    onLoadError: () => overlay.showError('Could not load model'),
    onHoverPart: (categoryId) => {
        canvas.style.cursor = categoryId ? 'pointer' : 'default'
    },
    onSelectPart: (categoryId) => {
        configPanel.focusCategory(categoryId);
    }
});

const configPanel = new ConfiguratorPanel(document.body, experience.store);



