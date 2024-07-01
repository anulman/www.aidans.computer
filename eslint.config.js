import parser from '@typescript-eslint/parser';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';

export default [
  {
    files: ['*.config.js', '*.config.ts', '**/*.ts', '**/*.tsx'],
    languageOptions: { parser },
    ...reactRecommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
