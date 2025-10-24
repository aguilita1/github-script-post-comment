import config from "eslint-config-xo";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["package-lock.json", "ext_script.js",],
  },
  config,
  {
    languageOptions: {
      globals: {
        github: "readonly",
        context: "readonly",
        core: "readonly",
        glob: "readonly",
        io: "readonly",
        exec: "readonly",
        require: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "@stylistic/eol-last": "off",
      "@stylistic/indent": "off",
      "@stylistic/indent-binary-ops": "off",
      "@stylistic/object-curly-spacing": "off",
      "@stylistic/quotes": "off",
      camelcase: [
        "warn",
        { allow: ["issue_number"] },
      ],
      "no-new-func": "off",
      "object-shorthand": "off",
      "no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^(github|context|core|glob|io|exec|require)$" },
      ],
    },
  },
]);
