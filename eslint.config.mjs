// eslint.config.js
import eslintPluginPrettier from "eslint-plugin-prettier";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: ["node_modules", "dist", "coverage", ".eslintrc.js"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        require: "readonly",
        module: "writable",
        __dirname: "readonly",
      },
    },

    plugins: {
      prettier: eslintPluginPrettier,
    },

    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
  prettier, // extends Prettier rules
];
