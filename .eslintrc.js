// /** @type {import('eslint').Linter.Config} */
// module.exports = {
//   root: true,
//   env: { es6: true, node: true, jest: true },
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaVersion: 2021,
//     sourceType: 'module',
//     ecmaFeatures: { jsx: true },
//   },
//   plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-native', 'prettier'],
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react/recommended',
//     'plugin:react-hooks/recommended',
//     'plugin:react-native/all',
//     'plugin:prettier/recommended', // en sonda kalsın
//   ],
//   settings: {
//     react: { version: 'detect' },
//   },
//   rules: {
//     // Prettier ihlallerini ESLint hatasına çevir
//     'prettier/prettier': 'error',

//     // Sık kullanılan pratik TS/React kuralları
//     '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
//     'react/react-in-jsx-scope': 'off', // RN & yeni React için gerekli değil
//     'react-native/no-inline-styles': 'off', // RN’de bazen gerekli oluyor
//   },
//   ignorePatterns: ['node_modules/', 'dist/', 'build/', 'coverage/', 'android/', 'ios/', '.expo/'],
// };
