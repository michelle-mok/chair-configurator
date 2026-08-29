import './style.css';
import { Experience } from "./Experience/Experience";
import { LoadingOverlay } from "./ui/LoadingOverlay";
import { ConfiguratorPanel } from "./ui/ConfiguratorPanel";
import { UrlSync } from "./ui/UrlSync";
import Stats from 'stats.js';

const container = document.querySelector<HTMLDivElement>('.configurator');
if(!container) throw new Error('.configurator not found');

const canvas = document.querySelector<HTMLCanvasElement>('#webgl');
if (!canvas) throw new Error('canvas #webgl not found');

const overlay = new LoadingOverlay(container);

const params = new URLSearchParams(window.location.search);
let stats: Stats | null = null;
if (params.has('stats')) {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

const experience = new Experience(canvas, {
    onLoadProgress: (ratio) => overlay.setProgress(ratio),
    onLoadComplete: () => overlay.dispose(),
    onLoadError: () => overlay.showError('Could not load model'),
    onHoverPart: (categoryId) => {
        container.style.cursor = categoryId ? 'pointer' : 'default'
    },
    onSelectPart: (categoryId) => {
        configPanel.focusCategory(categoryId);
    },
    onFrame: () => {
        stats?.update();
    }
});

const configPanel = new ConfiguratorPanel(container, experience.store);

new UrlSync(experience.store);



