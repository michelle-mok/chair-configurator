# Chair Configurator

An interactive 3D product configurator that lets customers customise the product and see instant results, and can be placed in any existing page. It is built with Three.js, no third-party configurator platform.

It allows a customer to orbit around the product, change the material on the configurable parts, see the price changes live, and reset to default options by clicking the reset button. Clicking on a chair part also highlights its section in the UI panel. Every configuration has its own link, so the customer can save it and come back to it later, or share it.

The options are stored in a single config file which is easy to extend. Adding a category only required changes to 2 files and no new UI code. The product has 4 parts, 3 of which are configurable. The 3 configurable parts have a total of 8 options across the board. 

The configurator loads in less than a second on a 4G connection (compressed from 4.5MB to 756KB) so that customers on mobile aren't left waiting. It also runs at full frame rate on a phone as the customer rotates the product, resulting in a smooth experience with no stutter.

**Live Demo:** [chair-configurator-indol.vercel.app](https://chair-configurator-indol.vercel.app/)

![screenshot](docs/screenshot.png)


## Architecture

- Experience owns the chair configurator app. `main.ts` owns the DOM and knows nothing about the Three.js internals, so that the app can drop into any page. Experience is instantiated from `main.ts` with a canvas.

- Config driven product data - Product data (categories, options, prices and part mappings) lives in one typed config file (`productConfig.ts`); the UI panel, price calculation and material generation all get their data from it.

- The store (`ConfiguratorStore.ts`) is plain TypeScript, no DOM or Three.js dependency, which also makes the store unit testable. 18 tests cover the store's contract, config invariants and URL parsing at the untrusted boundary. UI calls select → store notifies → scene and panel re-render from state. 


## Running locally

```bash
npm install
npm run dev     # dev server
npm test        # test suite in watch mode
npm run build   # production build
```

## Credits

- **SheenChair** model [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets), CC0 1.0, © 2020 Wayfair LLC (Eric Chadwick)