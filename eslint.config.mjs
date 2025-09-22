import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      ".turbo/**",
      "next-env.d.ts",
      "*.min.js",
      "*.min.css",
      "**/*.config.js",
      "**/*.config.mjs",
      "public/**",
    ],
    rules: {
      // TypeScript specific
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
      
      // React specific
      "react/jsx-curly-brace-presence": [
        "error",
        {
          "props": "never",
          "children": "never"
        }
      ],
      "react/self-closing-comp": "error",
      
      // General code quality
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error"
    }
  },
];

export default eslintConfig;
