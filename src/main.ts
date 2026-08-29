import './style.css';
import { Experience } from "./Experience/Experience";
import { LoadingOverlay } from "./ui/LoadingOverlay";
import { ConfiguratorPanel } from "./ui/ConfiguratorPanel";
import { UrlSync } from "./ui/UrlSync";

const container = document.querySelector<HTMLDivElement>('.configurator');
if(!container) throw new Error('.configurator not found');

const canvas = document.querySelector<HTMLCanvasElement>('#webgl');
if (!canvas) throw new Error('canvas #webgl not found');

const overlay = new LoadingOverlay(container);

const experience = new Experience(canvas, {
    onLoadProgress: (ratio) => overlay.setProgress(ratio),
    onLoadComplete: () => overlay.dispose(),
    onLoadError: () => overlay.showError('Could not load model'),
    onHoverPart: (categoryId) => {
        container.style.cursor = categoryId ? 'pointer' : 'default'
    },
    onSelectPart: (categoryId) => {
        configPanel.focusCategory(categoryId);
    }
});

const configPanel = new ConfiguratorPanel(container, experience.store);

new UrlSync(experience.store);


