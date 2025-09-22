import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
  // Base JavaScript rules
  js.configs.recommended,

  // Vue files
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
      globals: {
        console: "readonly",
        setTimeout: "readonly",
        document: "readonly",
        window: "readonly",
        Event: "readonly",
        HTMLElement: "readonly",
        HTMLImageElement: "readonly",
        HTMLButtonElement: "readonly",
        KeyboardEvent: "readonly",
        Element: "readonly",
        Image: "readonly",
        URL: "readonly",
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Vue 3 recommended rules
      "vue/no-unused-vars": "error",
      "vue/multi-word-component-names": "off",
      "vue/component-definition-name-casing": ["error", "PascalCase"],
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/no-mutating-props": "error",
      "vue/no-v-html": "warn",
      "vue/require-default-prop": "off",
      "vue/require-explicit-emits": "error",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // General rules
      "no-console": "off",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      "indent": ["error", 4],
    },
  },

  // TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        setTimeout: "readonly",
        document: "readonly",
        window: "readonly",
        Event: "readonly",
        HTMLElement: "readonly",
        HTMLImageElement: "readonly",
        HTMLButtonElement: "readonly",
        KeyboardEvent: "readonly",
        Element: "readonly",
        Image: "readonly",
        URL: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-console": "off",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      "indent": ["error", 4],
    },
  },

  // Test files - more relaxed rules
  {
    files: ["**/*.test.ts", "**/*.test.js", "**/*.spec.ts", "**/*.spec.js"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".vite/**",
      "coverage/**",
      "*.config.js",
      "*.config.ts",
      "test-import.ts",
    ],
  },
];
