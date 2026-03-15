import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslint from '@eslint/js';

export default tseslint.config(
  {
    // 1. Pliki TypeScript (komponenty, serwisy, itp.)
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],

    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      // Twoje własne reguły:
      "no-console": "warn",
    },
  },
  {
    // 2. Pliki HTML (szablony Angulara)
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Przykład reguły dla HTML:
      "@angular-eslint/template/no-any": "error"
    },
  }
);