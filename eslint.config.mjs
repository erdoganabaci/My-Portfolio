import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import {fileURLToPath} from "node:url";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

export default tseslint.config(
  {
    ignores: [
      ".agent/**",
      "build/**",
      "coverage/**",
      "dist/**",
      "eslint.config.mjs",
      "node_modules/**",
      "scripts/**",
      "src/assets/lottie/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["src/**/*.{ts,tsx}", "vite.config.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir
      },
      sourceType: "module"
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true
        }
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports"
        }
      ]
    }
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/app/*"]
        }
      ]
    }
  },
  {
    files: [
      "src/components/**/*.{ts,tsx}",
      "src/config/**/*.{ts,tsx}",
      "src/lib/**/*.{ts,tsx}"
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/app/*", "@/features/*"]
        }
      ]
    }
  },
  {
    files: ["src/testing/**/*.{ts,tsx}", "src/features/theme/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off"
    }
  }
);
