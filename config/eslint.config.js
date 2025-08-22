// // https://docs.expo.dev/guides/using-eslint/
// const { defineConfig } = require('eslint/config');
// const expoConfig = require('eslint-config-expo/flat');

// module.exports = defineConfig([
//   expoConfig,
//   {
//     ignores: ['dist/*'],
//   },
//   {
//     files: ['**/*.{js,jsx,ts,tsx}'],
//     languageOptions: {
//       parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//         ecmaFeatures: {
//           jsx: true,
//         },
//       },
//     },
//     plugins: {
//       prettier: require('eslint-plugin-prettier'),
//       '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
//     },
//     rules: {
//       'prettier/prettier': 'error',
//       'arrow-body-style': 'off',
//       'prefer-arrow-callback': 'off',
//       '@typescript-eslint/no-unused-vars': [
//         'warn',
//         {
//           argsIgnorePattern: '^_',
//           varsIgnorePattern: '^_',
//           caughtErrorsIgnorePattern: '^_',
//         },
//       ],
//       'no-unused-vars': [
//         'warn',
//         {
//           argsIgnorePattern: '^_',
//           varsIgnorePattern: '^_',
//           caughtErrorsIgnorePattern: '^_',
//         },
//       ],
//     },
//   },
// ]);
