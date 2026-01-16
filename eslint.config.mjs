import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended, // TS rules
  prettier,                        // disable rules conflicting with Prettier
  {
    files: ["src/**/*.ts"],
    ignores: ["node_modules/**", "dist/**", "build/**"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      semi: ["error", "always"],
      "space-before-function-paren": "off",
      camelcase: "off",
      "no-return-assign": "off",
      quotes: ["error", "single"],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": "warn"
    },
  },
]);
