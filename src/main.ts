import { Experience } from "./Experience/Experience";

const canvas = document.querySelector<HTMLCanvasElement>('#webgl');
if (!canvas) throw new Error('canvas #webgl not found');

new Experience(canvas);