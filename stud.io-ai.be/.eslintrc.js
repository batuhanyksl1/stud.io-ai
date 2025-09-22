module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {},
      node: {extensions: [".js", ".ts", ".d.ts"]},
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // Bazı ortamlarda "project" TS config çözümlemesi hataya yol açabiliyor.
    // Predeploy'da hızlı ve stabil olması için kapatıyoruz.
    project: null,
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {jsx: false},
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
  ],
  ignorePatterns: [
    "node_modules/",
    "lib/",
    "dist/",
    "generated/",
    "**/*.d.ts",
  ],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: false, // TS Project'a kilitlenme — basit parse
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022,
        sourceType: "module",
      },
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        // İstediğin kuralları burada özelleştirebiliriz
      },
    },
    {
      files: ["**/*.js"],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
  ],
  rules: {
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "import/no-unresolved": 0,
    "import/namespace": 0,
    "import/no-duplicates": 0,
    // Google stilinde kapatma zorunluluklarını yumuşatmak istersen buraya
    // ekleyebiliriz
  },
};
