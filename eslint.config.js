import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default defineConfig({
    ignores: ['eslint.config.js', 'vite.config.ts'],
    files: ['**/*.{js,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked, prettier],
    languageOptions: {
        parserOptions: {
            projectService: {
                allowDefaultProject: ['*.js', '*.ts'],
            },
            tsconfigRootDir: import.meta.dirname,
        },
    },
});
